import React, { useState, useEffect, useMemo } from 'react';
import '../../../css/Perfil/HistorialCompras.css';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Registrar módulos de AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

const apiUrl = import.meta.env.VITE_API_URL;

const HistorialCompras = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroEmail, setFiltroEmail] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');

    // Estado para modal detalle
    const [modalDetalle, setModalDetalle] = useState({ productos: null, isMayorista: false });


    useEffect(() => {
        axios.get(`${apiUrl}/orders/todas`)
            .then(res => setOrdenes(res.data))
            .catch(err => console.error('Error al obtener las órdenes:', err));
    }, []);

    const ordenesFiltradas = useMemo(() => {
        return ordenes.filter((orden) => {
            const nombreMatch = orden.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
            const emailMatch = orden.email.toLowerCase().includes(filtroEmail.toLowerCase());
            const estadoMatch = orden.estado.toLowerCase().includes(filtroEstado.toLowerCase());
            return nombreMatch && emailMatch && estadoMatch;
        });
    }, [ordenes, filtroNombre, filtroEmail, filtroEstado]);

    const columnDefs = useMemo(() => [
        { headerName: "#", valueGetter: "node.rowIndex + 1", width: 70 },
        { headerName: "Cliente", field: "nombre", sortable: true, filter: true },
        { headerName: "Email", field: "email", sortable: true, filter: true },
        { headerName: "Teléfono", field: "telefono", sortable: true },
        { headerName: "Dirección", field: "direccion", sortable: true },
        { headerName: "Fecha", valueGetter: params => new Date(params.data.fecha).toLocaleDateString(), sortable: true },
        { headerName: "Total", valueGetter: params => `$${params.data.total.toFixed(2)}`, sortable: true },
        { headerName: "Estado", field: "estado", sortable: true, filter: true },
        { headerName: "Productos", valueGetter: params => params.data.productos.length },
        {
            headerName: "Detalle",
            cellRenderer: (params) => {
                return (
                    <div style={{ textAlign: "center" }}>
                        <button
                            className="btn-detalle"
                            onClick={() => {
                                const totalKg = params.data.productos.reduce((acc, p) => acc + p.quantity, 0);
                                setModalDetalle({ productos: params.data.productos, isMayorista: totalKg >= 10 });
                            }}
                        >
                            Ver detalle
                        </button>
                    </div>
                );
            }
        }
    ], []);

    return (
        <div className="historial-container">
            <h2 className="titulos-admin">Historial de Compras</h2>

            {/* Filtros */}
            <div className="filtros-ordenes">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    className="input-busqueda-ordenes"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Buscar por email"
                    className="input-busqueda-ordenes"
                    value={filtroEmail}
                    onChange={(e) => setFiltroEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Buscar por estado"
                    className="input-busqueda-ordenes"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                />
            </div>

            {/* Tabla AG Grid */}
            <div className="ag-theme-alpine" style={{ height: 350, width: '100%', maxWidth: '100%', overflowX: 'auto', boxSizing: 'border-box' }}>
                <AgGridReact
                    rowData={ordenesFiltradas}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={false}
                />
            </div>

            {/* Modal detalle productos */}
            {modalDetalle.productos && (
                <div className="modal-fondo" onClick={() => setModalDetalle({ productos: null, isMayorista: false })}>
                    <div className="modal-contenido" onClick={e => e.stopPropagation()}>
                        <h3>Detalle de productos</h3>
                        <table className="subtabla" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad (kg)</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modalDetalle.productos.map((prod, idx) => {
                                    const subtotal = prod.precio * prod.quantity;
                                    return (
                                        <tr key={idx}>
                                            <td>{prod.nombre}</td>
                                            <td>
                                                ${prod.precio.toFixed(2)} ({modalDetalle.isMayorista ? 'Mayorista' : 'Minorista'})
                                            </td>
                                            <td>{prod.quantity.toFixed(2)}</td>
                                            <td>${subtotal.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <button className="btn-cerrar" onClick={() => setModalDetalle({ productos: null, isMayorista: false })}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistorialCompras;
