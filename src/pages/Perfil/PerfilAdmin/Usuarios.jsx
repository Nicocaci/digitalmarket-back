import React from 'react';
import '../../../css/Perfil/Usuarios.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEmail, setFiltroEmail] = useState('');
  const [filtroDni, setFiltroDni] = useState('');
  const [filtroDireccion, setFiltroDireccion] = useState('');

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
        <div className="filtros-usuarios">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido"
            className="input-filtro"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Buscar por email"
            className="input-filtro"
            value={filtroEmail}
            onChange={(e) => setFiltroEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Buscar por DNI"
            className="input-filtro"
            value={filtroDni}
            onChange={(e) => setFiltroDni(e.target.value)}
          />
          <input
            type="text"
            placeholder="Buscar por dirección"
            className="input-filtro"
            value={filtroDireccion}
            onChange={(e) => setFiltroDireccion(e.target.value)}
          />
        </div>

        <table className='tabla-compras'>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre Completo</th>
              <th>Dni</th>
              <th>Direccion</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Carrito</th>
            </tr>
          </thead>
          <tbody>
            {usuarios
              .filter((u) => {
                const nombreCompleto = `${u.nombre} ${u.apellido}`.toLowerCase();
                return (
                  nombreCompleto.includes(filtroNombre.toLowerCase()) &&
                  u.email.toLowerCase().includes(filtroEmail.toLowerCase()) &&
                  u.dni.toString().includes(filtroDni) &&
                  u.direccion.toLowerCase().includes(filtroDireccion.toLowerCase())
                );
              })
              .map((u, index) => (
                <tr key={u._id}>
                  <td>{index + 1}</td>
                  <td>{u.nombre} {u.apellido}</td>
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