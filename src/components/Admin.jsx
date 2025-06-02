import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api'; // ✅ Import du service API
import './Admin.css';
import logoOmac from '../assets/omac-logo.png';

const Admin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        mot_de_passe: '', // ✅ Changé pour correspondre à votre BDD
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    // ✅ Vérification d'authentification au chargement
    useEffect(() => {
        console.log('🔍 État de la connexion au chargement:', {
            hasToken: !!localStorage.getItem('omac_token'),
            isAuthenticated: ApiService ? ApiService.isAuthenticated() : 'ApiService non disponible',
            currentPath: window.location.pathname
        });

        // Si déjà connecté, rediriger directement vers le dashboard
        if (ApiService && ApiService.isAuthenticated()) {
            console.log('👤 Utilisateur déjà connecté, redirection automatique vers dashboard...');
            navigate('/admin/dashboard', { replace: true });
        }
    }, [navigate]);

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

        if (!formData.mot_de_passe) {
            newErrors.mot_de_passe = 'Le mot de passe est requis';
        } else if (formData.mot_de_passe.length < 6) {
            newErrors.mot_de_passe = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ NOUVEAU : Gestion de la soumission avec l'API réelle + DEBUG
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');

        console.log('🟡 Début handleSubmit');

        if (!validateForm()) {
            console.log('❌ Validation échouée');
            return;
        }

        setIsLoading(true);

        try {
            console.log('🔄 Tentative de connexion...', { 
                username: formData.username, 
                password: '***' 
            });
            
            // Vérifier que ApiService existe
            if (!ApiService || !ApiService.login) {
                throw new Error('ApiService non disponible');
            }
            
            // ✅ Appel à l'API réelle SiteGround
            const response = await ApiService.login({
                username: formData.username,
                mot_de_passe: formData.mot_de_passe
            });

            console.log('✅ Connexion réussie:', response);

            // Sauvegarder la session si "Se souvenir de moi" est coché
            if (formData.rememberMe) {
                localStorage.setItem('omac_remember_user', formData.username);
            }

            // ✅ Le token et les infos admin sont automatiquement sauvegardés par ApiService.login()
            
            // Rediriger vers le dashboard admin
            console.log('🔄 Redirection vers dashboard...');
            navigate('/admin/dashboard');
            
        } catch (error) {
            console.error('❌ Erreur complète de connexion:', error);
            console.error('❌ Message d\'erreur:', error.message);
            console.error('❌ Stack trace:', error.stack);
            
            // Gestion des différents types d'erreurs
            if (error.message && error.message.includes('Identifiants invalides')) {
                setLoginError('Nom d\'utilisateur ou mot de passe incorrect');
            } else if (error.message && error.message.includes('Erreur de connexion')) {
                setLoginError('Problème de connexion au serveur. Vérifiez votre connexion internet.');
            } else if (error.message && error.message.includes('ApiService non disponible')) {
                setLoginError('Erreur technique : Service API non disponible');
            } else {
                setLoginError(`Erreur technique : ${error.message || 'Erreur inconnue'}`);
            }
        } finally {
            setIsLoading(false);
            console.log('🟡 Fin handleSubmit');
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
        alert('Pour réinitialiser votre mot de passe, contactez l\'administrateur système de l\'OMAC.\n\nEmail: omac.torcy77@gmail.com\nTéléphone: 01 60 31 31 01');
    };

    // ✅ NOUVEAU : Test de connexion API
    const testApiConnection = async () => {
        try {
            const result = await ApiService.testConnection();
            if (result) {
                alert('✅ Connexion API réussie ! Le serveur répond correctement.');
            } else {
                alert('❌ Pas de réponse du serveur. Vérifiez que le backend Node.js est démarré.');
            }
        } catch (error) {
            alert('❌ Erreur de connexion API: ' + error.message);
        }
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

                {/* ✅ NOUVEAU : Informations de connexion par défaut */}
                <div className="default-credentials" style={{
                    background: '#e8f4fd',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #bee5eb'
                }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>Identifiants par défaut :</h4>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>
                        <strong>Username:</strong> admin<br/>
                        <strong>Password:</strong> omac77200
                    </p>
                    <small style={{ color: '#6c757d' }}>
                        Ces identifiants correspondent à ceux de votre base SiteGround
                    </small>
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
                            placeholder="admin"
                            autoComplete="username"
                            disabled={isLoading}
                        />
                        {errors.username && (
                            <span className="error-message">{errors.username}</span>
                        )}
                    </div>

                    {/* Mot de passe */}
                    <div className="form-group">
                        <label htmlFor="mot_de_passe" className="form-label">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="mot_de_passe"
                            name="mot_de_passe"
                            value={formData.mot_de_passe}
                            onChange={handleInputChange}
                            className={`form-input ${errors.mot_de_passe ? 'error' : ''}`}
                            placeholder="omac77200"
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                        {errors.mot_de_passe && (
                            <span className="error-message">{errors.mot_de_passe}</span>
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
                        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>

                {/* ✅ NOUVEAU : Bouton de test API (en développement seulement) */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button 
                            onClick={testApiConnection}
                            style={{
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                padding: '8px 15px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}
                            disabled={isLoading}
                        >
                            Tester la connexion API
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;