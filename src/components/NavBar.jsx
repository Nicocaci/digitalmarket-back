import React, { useState, useEffect, useRef } from 'react';
import '../css/NavBar.css';
import logo from '/logoOpcion1.svg';
import { Link } from 'react-router-dom';
import CartDropdown from './CartDropdown';
import AuthModal from '../utils/AuthModal';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const NavBar = () => {
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // NUEVO
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

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
      <nav className='navBar'>
        <div className='logo'>
          <img className='logo' src={logo} alt="logo-migues" />
        </div>


        <button ref={buttonRef} className="hamburger" onClick={toggleMobileMenu}>
          ☰
        </button>


        <ul ref={menuRef} className={`navBar-list ${mobileMenuOpen ? 'open' : ''}`}>
          <li><Link className='navBar-title' to="/" onClick={() => setMobileMenuOpen(false)}>Inicio</Link></li>
          <li><Link className='navBar-title' to="/contacto" onClick={() => setMobileMenuOpen(false)}>Contacto</Link></li>
          <li><Link className='navBar-title' to="/comocomprar" onClick={() => setMobileMenuOpen(false)}>Como Comprar</Link></li>
          <li><Link className='navBar-title' to="/nosotros" onClick={() => setMobileMenuOpen(false)}>Nosotros</Link></li>
          <li><Link className='navBar-title' to="/perfil" onClick={() => setMobileMenuOpen(false)}>Perfil</Link></li>
          <li><button className='navBar-title login-button' onClick={() => openAuthModal('login')}>Iniciar Sesión</button></li>
          <li><button className='navBar-title login-button' onClick={() => openAuthModal('register')}>Registrarse</button></li>
          <li><button className='navBar-title login-button' onClick={handleLogout}>Cerrar Sesión</button></li>
          <div className='logo-cart-container'>
            <button className='cart-button' onClick={toggleCart}>🛒</button>
            <CartDropdown visible={showCart} onClose={() => setShowCart(false)} />
          </div>
        </ul>


      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        type={authType}
      />
    </div>
  );
};

export default NavBar;
