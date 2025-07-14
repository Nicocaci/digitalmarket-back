import React, { useState, useEffect } from 'react';
import '../css/Footer.css';
import AuthModal from '../utils/AuthModal';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';


const Footer = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authType, setAuthType] = useState('login');
    const [userId, setUserId] = useState(null);


    useEffect(() => {
        const token = Cookies.get('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded._id);
            } catch (err) {
                console.error("Error al decodificar el token:", err);
            }
        }
    }, []);

    const openAuthModal = (type) => {
        if (userId) return; // Si ya está logueado, no hacer nada
        setAuthType(type);
        setShowAuthModal(true);
    };


    return (
        <>
            <footer className='seccion-footer'>
                <div className='seccion-container' >
                    <ul className='footer'>
                        <h2 className='titulo-footer center'>Ayuda</h2>
                        <li className='footer-content'><a href="/faq">Cómo Comprar?</a></li>
                        <li className='footer-content'><a href="/faq">Formas de Envío</a></li>
                        <li className='footer-content'><a href="/contacto">Contacto</a></li>
                    </ul>
                </div>
                <div className='seccion-container'>
                    <ul className='footer'>
                        <h2 className='titulo-footer center'>Mi cuenta</h2>
                        {userId ? (
                            <li className='footer-content'><a href="/perfil">Perfil</a></li>
                        ) : (
                            <>
                                <li className='footer-content'>
                                    <button className="link-footer" onClick={() => openAuthModal('login')}>Iniciar Sesión</button>
                                </li>
                                <li className='footer-content'>
                                    <button className="link-footer" onClick={() => openAuthModal('register')}>Registrarse</button>
                                </li>
                            </>
                        )}

                    </ul>
                </div>
                <div className='seccion-container-new'>
                    <ul className='footer'>
                        <h2 className='titulo-footer center'>Siganos en las redes</h2>
                        <li className='footer-content'>Ig</li>
                        <li className='footer-content'>TikTok</li>
                        <li className='footer-content'>Facebook</li>
                    </ul>
                </div>
            </footer>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                type={authType}
                setType={setAuthType}
            />
        </>
    );
};

export default Footer;
