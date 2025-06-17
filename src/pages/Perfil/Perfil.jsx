import React, { useState, useEffect } from 'react';
import PerfilAdmin from './PerfilAdmin/PerfilAdmin';
import PerfilUser from './PerfilUser/PerfilUser';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import AuthModal from '../../utils/AuthModal';
import { useNavigate } from 'react-router-dom';


const Perfil = () => {
  const [rol, setRol] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authType, setAuthType] = useState('login'); // 'login' o 'register'
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Token decodificado:", decoded);
        setRol(decoded.role);
      } catch (err) {
        console.error("Error al decodificar el token:", err);
        setShowLoginModal(true);
      }
    } else {
      console.warn("No se encontró el token en cookies.");
      setShowLoginModal(true);
    }
  }, []);

    const handleCloseModal = () => {
    setShowLoginModal(false);
    const token = Cookies.get('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRol(decoded.rol);
      } catch (err) {
        console.error("Error al decodificar después del login");
      }
    } else {
      // Si todavía no hay token => redirigir al inicio
      navigate('/');
    }
  };


  return (
    <div>
      <h1>Perfil</h1>
      {rol === 'admin' && <PerfilAdmin />}
      {rol === 'user' && <PerfilUser />}

      {/* Modal de login si no hay sesión */}
      <AuthModal
        isOpen={showLoginModal}
        onClose={handleCloseModal}
        type={authType}
        setType={setAuthType}
      />
    </div>
  );
}

export default Perfil