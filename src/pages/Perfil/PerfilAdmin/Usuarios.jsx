import React, { useState, useEffect, useMemo } from 'react';
import '../../../css/Perfil/Usuarios.css';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const apiUrl = import.meta.env.VITE_API_URL;

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEmail, setFiltroEmail] = useState('');
  const [filtroDni, setFiltroDni] = useState('');
  const [filtroDireccion, setFiltroDireccion] = useState('');

  // Estado para modal carrito
  const [modalCarrito, setModalCarrito] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${apiUrl}/usuario`);
      if (Array.isArray(response.data)) {
        setUsuarios(response.data);
      } else {
        console.error("La API no devolvió un array", response.data);
        setUsuarios([]);
      }
    } catch (error) {
      console.error("Error al obtener los usuarios", error);
    }
  };

  // Filtrar usuarios según filtros
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const nombreCompleto = `${u.nombre} ${u.apellido}`.toLowerCase();
      return (
        nombreCompleto.includes(filtroNombre.toLowerCase()) &&
        u.email.toLowerCase().includes(filtroEmail.toLowerCase()) &&
        u.dni.toString().includes(filtroDni) &&
        u.direccion.toLowerCase().includes(filtroDireccion.toLowerCase())
      );
    });
  }, [usuarios, filtroNombre, filtroEmail, filtroDni, filtroDireccion]);

  // Columnas para AG Grid
  const columnDefs = useMemo(() => [
    { headerName: "#", valueGetter: "node.rowIndex + 1", width: 70 },
    { headerName: "Nombre Completo", valueGetter: (params) => `${params.data.nombre} ${params.data.apellido}`, sortable: true, filter: true },
    { headerName: "DNI", field: "dni", sortable: true, filter: true, width: 120 },
    { headerName: "Dirección", field: "direccion", sortable: true, filter: true },
    { headerName: "Email", field: "email", sortable: true, filter: true },
    { headerName: "Rol", field: "role", sortable: true, filter: true, width: 100 },
    {
      headerName: "Carrito",
      field: "cart",
      cellRenderer: (params) => (
        <button className="btn-detalle" onClick={() => setModalCarrito(params.data.cart)}>
          Ver carrito
        </button>
      ),
      width: 150,
      suppressMenu: true,
      sortable: false,
      filter: false
    }
  ], []);

  return (
    <div className='seccion-usuarios'>
      <h2 className='titulos-admin'>Listado de Clientes</h2>

      <div className="filtros-usuarios" style={{ marginBottom: 10 }}>
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

      <div className="ag-theme-alpine" style={{ height: 350, width: '100%' }}>
        <AgGridReact
          rowData={usuariosFiltrados}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={false}
          domLayout="autoHeight"
        />
      </div>

      {/* Modal carrito */}
      {modalCarrito && (
        <div className="modal-carrito">
          <div className="modal-content-carrito">
            <h3>Detalle del Carrito</h3>
            {Array.isArray(modalCarrito) && modalCarrito.length > 0 ? (
              <table className="tabla-carrito">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {modalCarrito.map((item, i) => (
                    <tr key={i}>
                      <td>{item.nombre}</td>
                      <td>{item.quantity}</td>
                      <td>${item.precio.toFixed(2)}</td>
                      <td>${(item.precio * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>El carrito está vacío.</p>
            )}
            <button className="btn-cerrar-modal" onClick={() => setModalCarrito(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Estilos básicos para modal */}
      <style>{`
        .modal-carrito {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal-content-carrito {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
        }
        .tabla-carrito {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        .tabla-carrito th, .tabla-carrito td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        .btn-cerrar-modal {
          background: #d33;
          color: white;
          border: none;
          padding: 10px 15px;
          cursor: pointer;
          border-radius: 4px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Usuarios;
