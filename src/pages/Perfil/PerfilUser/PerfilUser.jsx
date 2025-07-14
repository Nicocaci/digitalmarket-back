import React, { useState, useEffect } from 'react';
import '../../../css/Perfil/PerfilUser.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Pedidos from './Pedidos.jsx';
const apiUrl = import.meta.env.VITE_API_URL;



const PerfilUser = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('cuenta');
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    dni: '',
    direccion: ''
  });



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
      setFormData(response.data); // para precargar el formulario
    } catch (error) {
      console.error("Error al obtener el usuario", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/usuario/${userId}`, formData);
      alert("Información actualizada con éxito");
    } catch (error) {
      console.error("Error al actualizar los datos del usuario", error);
      alert("Hubo un error al actualizar tus datos.");
    }
  };
  return (
    <div>
      <div className='center'>
        <h1 className='titulo-user'>Perfil User</h1>
      </div>
      <div className='seccion-form'>
        <div >
          <ul className='navbar-usuario'>
            <li className={`link-usuario ${activeTab === 'cuenta' ? 'activo' : ''}`} onClick={() => setActiveTab('cuenta')}>
              <span className='titulo-navBar'><h4>Mi Cuenta</h4></span>
            </li>
            <li className={`link-usuario ${activeTab === 'pedidos' ? 'activo' : ''}`} onClick={() => setActiveTab('pedidos')}>
              <span className='titulo-navBar'><h4>Mis Pedidos</h4></span>
            </li>
          </ul>

        </div>
        <div className='form-usuario'>
          {activeTab === 'cuenta' && (
            <>
              <h4 className='titulo-tabla-usuario'>Datos Personales</h4>
              <form className='formUser' onSubmit={handleUpdate}>
                <label>Email: </label>
                <input type="email" name='email' value={formData.email} onChange={handleChange} />

                <label>Nombre: </label>
                <input type="text" name='nombre' value={formData.nombre} onChange={handleChange} />

                <label>Apellido: </label>
                <input type="text" name='apellido' value={formData.apellido} onChange={handleChange} />

                <label>DNI: </label>
                <input type="text" name='dni' value={formData.dni} onChange={handleChange} />

                <label>Dirección: </label>
                <input type="text" name='direccion' value={formData.direccion} onChange={handleChange} />
                <div className='center'>
                <button className='btn-usuario' type='submit'>Actualizar Información</button>
                </div>
              </form>
            </>
          )}

          {activeTab === 'pedidos' && <Pedidos />}
        </div>

      </div>

    </div>

  )
}

export default PerfilUser