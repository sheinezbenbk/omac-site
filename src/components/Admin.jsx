import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import logoOmac from '../assets/omac-logo.png';

const Admin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    // Gestion du retour à l'accueil
    const handleBackToHome = () => {
        navigate('/');
    };

    // Gestion des changements dans le formulaire
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Effacer l'erreur du champ modifié
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        
        // Effacer le message d'erreur général
        if (loginError) {
            setLoginError('');
        }
    };

    // Validation du formulaire
    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Le nom d\'utilisateur est requis';
        }

        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Simulation d'une requête d'authentification
            // Dans un vrai projet, tu ferais un appel API ici
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulation de vérification des identifiants
            // Remplace par ta logique d'authentification réelle
            if (formData.username === 'admin' && formData.password === 'omac2025') {
                // Connexion réussie
                console.log('Connexion réussie !');
                
                // Sauvegarder la session si "Se souvenir de moi" est coché
                if (formData.rememberMe) {
                    localStorage.setItem('omac_remember_user', formData.username);
                }
                
                // Sauvegarder l'état de connexion
                sessionStorage.setItem('omac_admin_logged', 'true');
                
                // ✅ Rediriger vers le dashboard admin
                navigate('/admin/dashboard');
                
            } else {
                // Identifiants incorrects
                setLoginError('Nom d\'utilisateur ou mot de passe incorrect');
            }
        } catch (error) {
            setLoginError('Une erreur est survenue. Veuillez réessayer.');
            console.error('Erreur de connexion:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Charger les données sauvegardées au chargement
    useEffect(() => {
        const rememberedUser = localStorage.getItem('omac_remember_user');
        if (rememberedUser) {
            setFormData(prev => ({
                ...prev,
                username: rememberedUser,
                rememberMe: true
            }));
        }
    }, []);

    // Gestion du "Mot de passe oublié"
    const handleForgotPassword = () => {
        alert('Fonctionnalité "Mot de passe oublié" à implémenter.\nContactez l\'administrateur système pour réinitialiser votre mot de passe.');
    };

    return (
        <div className="admin-page">
            {/* Bouton retour */}
            <button className="back-button" onClick={handleBackToHome}>
                ← Retour à l'accueil
            </button>

            {/* Conteneur de connexion */}
            <div className="login-container">
                {/* Header */}
                <div className="login-header">
                    <div className="admin-logo">
                        <img src={logoOmac} alt="Logo OMAC" />
                    </div>
                    <h1 className="login-title">Administration OMAC</h1>
                    <p className="login-subtitle">Connectez-vous pour gérer le site</p>
                </div>

                {/* Message d'erreur général */}
                {loginError && (
                    <div className="error-message">
                        {loginError}
                    </div>
                )}

                {/* Formulaire de connexion */}
                <form className="login-form" onSubmit={handleSubmit}>
                    {/* Nom d'utilisateur */}
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            Nom d'utilisateur
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={`form-input ${errors.username ? 'error' : ''}`}
                            placeholder="Saisissez votre nom d'utilisateur"
                            disabled={isLoading}
                        />
                        {errors.username && (
                            <span className="error-message">{errors.username}</span>
                        )}
                    </div>

                    {/* Mot de passe */}
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`form-input ${errors.password ? 'error' : ''}`}
                            placeholder="Saisissez votre mot de passe"
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <span className="error-message">{errors.password}</span>
                        )}
                    </div>

                    {/* Options de connexion */}
                    <div className="login-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                                className="remember-checkbox"
                                disabled={isLoading}
                            />
                            Se souvenir de moi
                        </label>
                        
                        <button
                            type="button"
                            className="forgot-password"
                            onClick={handleForgotPassword}
                            disabled={isLoading}
                        >
                            Mot de passe oublié ?
                        </button>
                    </div>

                    {/* Bouton de connexion */}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading && <span className="loading"></span>}
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Admin;