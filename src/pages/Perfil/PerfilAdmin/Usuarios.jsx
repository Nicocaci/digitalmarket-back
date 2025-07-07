import React from 'react';
import '../../../css/Perfil/Usuarios.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${apiUrl}/usuario`)
      if (Array.isArray(response.data)) {
        setUsuarios(response.data);
      } else {
        console.error("La API no devolvió un array", response.data);
        setUsuarios([]);
      }
    } catch (error) {
      console.error("Error al obtener los usuarios", error);
    }
  }

  return (
    <div className='seccion-usuarios'>
      <div>
        <h2 className='titulos-admin'>Listado de Clientes</h2>
      </div>
      <div className='scroll'>
        <table className='tabla-compras'>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Dni</th>
              <th>Direccion</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Carrito</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, index) => (
              <tr key={u._id}>
                <td>{index + 1}</td>
                <td>{u.nombre}</td>
                <td>{u.apellido}</td>
                <td>{u.dni}</td>
                <td>{u.direccion}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.cart}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Usuarios