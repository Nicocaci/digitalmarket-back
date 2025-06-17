import React, { useState } from 'react';
import '../css/AuthModal.css';
import axios from 'axios';
import { useCart } from '../context/CartContext';
const apiUrl = import.meta.env.VITE_API_URL;

const AuthModal = ({ isOpen, onClose, type, setType }) => {
  const { refreshCartContext } = useCart();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    direccion: '',
    email: '',
    contraseña: '',
    confirmar: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = type === 'login' ? `${apiUrl}/usuario/login` : `${apiUrl}/usuario/registro`;

    const payload =
      type === 'login'
        ? { email: formData.email, contraseña: formData.contraseña }
        : {
            nombre: formData.nombre,
            apellido: formData.apellido,
            dni: formData.dni,
            direccion: formData.direccion,
            email: formData.email,
            contraseña: formData.contraseña,
            role: 'user',
          };

    try {
      const response = await axios.post(endpoint, payload, {
        withCredentials: true,
      });

      alert(response.data.message);
      onClose();
      refreshCartContext();

          // 👇 Refrescar la página automáticamente
    window.location.reload();
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert('Error de conexión con el servidor');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{type === 'login' ? 'Iniciar sesión' : 'Registrarse'}</h2>

        <form onSubmit={handleSubmit}>
          {type === 'register' && (
            <>
              <div className="form-group">
                <label>Nombre:</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Apellido:</label>
                <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>DNI:</label>
                <input type="text" name="dni" value={formData.dni} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Dirección:</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} required />
          </div>

          {type === 'register' && (
            <div className="form-group">
              <label>Confirmar contraseña:</label>
              <input type="password" name="confirmar" value={formData.confirmar} onChange={handleChange} required />
            </div>
          )}

          <button type="submit" className="submit-btn">
            {type === 'login' ? 'Ingresar' : 'Registrarme'}
          </button>
        </form>

        {/* Botón para alternar entre login y registro */}
        <div className="modal-footer">
          {type === 'login' ? (
            <p>
              ¿No tenés cuenta?{" "}
              <button className="link-btn" onClick={() => setType('register')}>
                Registrate
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tenés cuenta?{" "}
              <button className="link-btn" onClick={() => setType('login')}>
                Iniciar sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
