import React from 'react';
import '../css/NavBar.css';
import logo from '/logomigues.png';
import { Link } from 'react-router-dom';
import CartDropdown from './CartDropdown';
import { useState } from 'react';
import AuthModal from '../utils/AuthModal';
import axios from 'axios';


const NavBar = () => {
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login');

  const toggleCart = () => {
    setShowCart(prev => !prev);
  };

  const openAuthModal = (type) => {
    setAuthType(type);
    setShowAuthModal(true);
  };
  const handleLogout = async () => {
    try {
      await axios.post('https://digitalmarket2-back-production.up.railway.app/api/usuario/logout', {}, { withCredentials: true });
      localStorage.removeItem('token'); // Limpiar token local
      // Opcional: recargar o redirigir a inicio después del logout
      window.location.href = '/';
    } catch (error) {
      console.error("Error en logout:", error);
      alert("No se pudo cerrar sesión, intenta nuevamente.");
    }
  };

  return (
    <div className='navBar-container'>
      <nav className='navBar'>
        <div>
          <img className='logo' src={logo} alt="logo-migues" />
        </div>
        <div>
          <ul className='navBar-list'>
            <li><Link className='navBar-title' to="/">Inicio</Link></li>
            <li><Link className='navBar-title' to="/contacto">Contacto</Link></li>
            <li><Link className='navBar-title' to="/comocomprar">Como Comprar</Link></li>
            <li><Link className='navBar-title' to="/nosotros">Nosotros</Link></li>
            <li><Link className='navBar-title' to="/perfil  ">Perfil</Link></li>
            <button className='navBar-title login-button' onClick={() => openAuthModal('login')}>
              Iniciar Sesión
            </button>
            <button className='navBar-title register-button' onClick={() => openAuthModal('register')}>
              Registrarse
            </button>
          </ul>
        </div>
        <div className='logo-cart-container'>
          <button className='cart-button' onClick={toggleCart}>🛒</button>
          <CartDropdown visible={showCart} onClose={() => setShowCart(false)} />
        </div>
        <div className='logout-button'>
          <button onClick={handleLogout}>Cerrar Sesion</button>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        type={authType}
      />
    </div>
  )
}

export default NavBar;