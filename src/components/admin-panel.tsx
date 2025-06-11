
import type React from "react"

import { useState, useRef } from "react"


interface AdminPanelProps {
  images: string[]
  onImagesUpdate: (images: string[]) => void
  onClose: () => void
}

export default function AdminPanel({ images, onImagesUpdate, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mot de passe admin (en production, utilisez une vraie authentification)
  const ADMIN_PASSWORD = "admin123"

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Mot de passe incorrect")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          if (result) {
            const newImages = [...images, result]
            onImagesUpdate(newImages)
          }
        }
        reader.readAsDataURL(file)
      }
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDeleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesUpdate(newImages)
  }

  const handleDeleteAll = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer toutes les images ?")) {
      onImagesUpdate([])
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Authentification Admin
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handleLogin} className="w-full">
              Se connecter
            </Button>
            <p className="text-sm text-gray-500 text-center">Mot de passe par défaut: admin123</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Gestion du Carrousel d'Images
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload d'images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ajouter des Images</h3>
            <div className="flex items-center gap-4">
              <Button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Choisir des Images
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="text-sm text-gray-500">Formats acceptés: JPG, PNG, GIF, WebP</span>
            </div>
          </div>

          {/* Liste des images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Images du Carrousel ({images.length})</h3>
              {images.length > 0 && (
                <Button variant="destructive" size="sm" onClick={handleDeleteAll} className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Tout Supprimer
                </Button>
              )}
            </div>

            {images.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune image uploadée. Le carrousel affichera des images par défaut.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video relative overflow-hidden rounded-lg border">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <Alert>
            <AlertDescription>
              <strong>Instructions:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Cliquez sur "Choisir des Images" pour ajouter plusieurs images</li>
                <li>• Les images sont stockées localement dans le navigateur</li>
                <li>• Survolez une image pour voir le bouton de suppression</li>
                <li>• Le carrousel change d'image automatiquement toutes les 4 secondes</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
