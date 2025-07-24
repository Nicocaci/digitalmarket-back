import React, { useState, useEffect } from 'react';
import '../../../css/Perfil/HistorialCompras.css';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const HistorialCompras = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [ordenActiva, setOrdenActiva] = useState(null);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroEmail, setFiltroEmail] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');

    useEffect(() => {
        axios.get(`${apiUrl}/orders/todas`)
            .then(res => setOrdenes(res.data))
            .catch(err => console.error('Error al obtener las órdenes:', err));
    }, []);

    const toggleDetalles = (id) => {
        setOrdenActiva(prev => (prev === id ? null : id));
    };

    const ordenesFiltradas = ordenes.filter((orden) => {
        const nombreMatch = orden.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
        const emailMatch = orden.email.toLowerCase().includes(filtroEmail.toLowerCase());
        const estadoMatch = orden.estado.toLowerCase().includes(filtroEstado.toLowerCase());
        return nombreMatch && emailMatch && estadoMatch;
    });

    return (
        <div className="historial-container">
            <h2 className="titulos-admin">Historial de Compras</h2>
            <div className='scroll'>
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

                <table className="tabla-compras">
                    <thead>
                        <tr className='titulo-tablas'>
                            <th>#</th>
                            <th>Cliente</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Productos</th>
                            <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordenesFiltradas.map((orden, index) => {
                            const totalKgOrden = orden.productos.reduce((acc, p) => acc + p.quantity, 0);
                            const isMayorista = totalKgOrden >= 10;

                            return (
                                <React.Fragment key={orden._id}>
                                    <tr className='tabla-titulos'>
                                        <td>{index + 1}</td>
                                        <td>{orden.nombre}</td>
                                        <td>{orden.email}</td>
                                        <td>{orden.telefono || '-'}</td>
                                        <td>{orden.direccion}</td>
                                        <td>{new Date(orden.fecha).toLocaleDateString()}</td>
                                        <td>${orden.total.toFixed(2)}</td>
                                        <td>{orden.estado}</td>
                                        <td>{orden.productos.length}</td>
                                        <td>
                                            <button className="btn-detalle" onClick={() => toggleDetalles(orden._id)}>
                                                {ordenActiva === orden._id ? 'Ocultar' : 'Ver detalle'}
                                            </button>
                                        </td>
                                    </tr>
                                    {ordenActiva === orden._id && (
                                        <tr className="fila-detalle">
                                            <td colSpan="10">
                                                <table className="subtabla">
                                                    <thead>
                                                        <tr>
                                                            <th>Producto</th>
                                                            <th>Precio</th>
                                                            <th>Cantidad</th>
                                                            <th>Subtotal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orden.productos.map((prod, idx) => {
                                                            console.log('producto:', prod.nombre, 'quantity:', prod.quantity, 'peso:', prod.peso);

                                                            const cantidadValida = typeof prod.quantity === 'number' && !isNaN(prod.quantity);
                                                            const pesoValido = typeof prod.peso === 'number' && !isNaN(prod.peso) && prod.peso !== 0;

                                                            const unidades = cantidadValida && pesoValido
                                                                ? Math.ceil(prod.quantity / prod.peso)
                                                                : 0;

                                                            const precioFinal = prod.precio; // ya viene con el recargo aplicado
                                                            const subtotal = precioFinal * prod.quantity;
                                                            

                                                            return (
                                                                <tr key={idx}>
                                                                    <td>{prod.nombre}</td>
                                                                    <td>
                                                                        ${precioFinal.toFixed(2)} ({isMayorista ? 'Mayorista' : 'Minorista'})
                                                                    </td>
                                                                    <td>
                                                                        {unidades} unidad{unidades !== 1 ? 'es' : ''} ({cantidadValida ? prod.quantity.toFixed(2) : '0'} kg)
                                                                    </td>
                                                                    <td>${subtotal.toFixed(2)}</td>
                                                                </tr>
                                                            );
                                                        })}





                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistorialCompras;
