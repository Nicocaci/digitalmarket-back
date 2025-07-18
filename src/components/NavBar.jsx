import React, { useState, useEffect, useRef } from 'react';
import '../css/NavBar.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import CartDropdown from './CartDropdown';
import AuthModal from '../utils/AuthModal';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
import LogoAnimado from '../utils/LogoAnimado';

const NavBar = () => {
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login');
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // NUEVO
  const menuRef = useRef(null);
  const buttonRef = useRef(null);


  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Token decodificado:", decoded);
        setUserId(decoded._id);
      } catch (err) {
        console.error("Error al decodificar el token:", err);
      }
    } else {
      console.warn("No se encontró el token en cookies.");
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUsuario();
    }
  }, [userId]);

  const fetchUsuario = async () => {
    try {
      const response = await axios.get(`${apiUrl}/usuario/${userId}`);
      setUserData(response.data); // .data, no todo el response
    } catch (error) {
      console.error("Error al obtener el usuario", error);
    }
  };

  const toggleCart = () => setShowCart(prev => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev); // NUEVO

  const openAuthModal = (type) => {
    setAuthType(type);
    setShowAuthModal(true);
    setMobileMenuOpen(false); // cerrar menú en móviles
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/usuario/logout`, {}, { withCredentials: true });
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (error) {
      console.error("Error en logout:", error);
      alert("No se pudo cerrar sesión, intenta nuevamente.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className='navBar-container'>
      <div className='nav-destacado'>
        <ul className='nav-destacado-list'>
          <li><button className='navBar-title login-button' onClick={() => openAuthModal('login')}>Iniciar Sesión</button></li>
          <li><button className='navBar-title login-button' onClick={() => openAuthModal('register')}>Registrarse</button></li>
          <li><button className='navBar-title login-button' onClick={handleLogout}>Cerrar Sesión</button></li>
        </ul>
      </div>

      <nav className='navBar'>
        <div className='logo-cart-container'>
          <button className='cart-button' onClick={toggleCart}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="30"
              fill="blue"
              className="bi bi-cart logo-cart"
              viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
            </svg>
          </button>
          <CartDropdown visible={showCart} onClose={() => setShowCart(false)} />
        </div>

        <div className='logo-div'>
          <a href="/"><LogoAnimado /></a>
        </div>


        <button ref={buttonRef} className="hamburger" onClick={toggleMobileMenu}>
          ☰
        </button>


        <ul ref={menuRef} className={`navBar-list ${mobileMenuOpen ? 'open' : ''}`}>
          <li><Link className='navBar-title' to="/" onClick={() => setMobileMenuOpen(false)}>Inicio</Link></li>
          <li><Link className='navBar-title' to="/productos" onClick={() => setMobileMenuOpen(false)}>Productos</Link></li>
          <li><Link className='navBar-title' to="/contacto" onClick={() => setMobileMenuOpen(false)}>Contacto</Link></li>
          <li><Link className='navBar-title' to="/faq" onClick={() => setMobileMenuOpen(false)}>FAQ</Link></li>
          <li><Link className='navBar-title' to="/perfil" onClick={() => setMobileMenuOpen(false)}>Perfil</Link></li>
          {userData && (
            <li className='navBar-title saludo-usuario'>Bienvenido, {userData.nombre}</li>
          )}
        </ul>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        type={authType}
        setType={setAuthType}
      />
    </div>
  );
};

export default NavBar;
