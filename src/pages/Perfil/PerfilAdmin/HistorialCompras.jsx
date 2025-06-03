import React from 'react';
import '../../../css/Perfil/HistorialCompras.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const HistorialCompras = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [ordenActiva, setOrdenActiva] = useState(null); // para el toggle

    useEffect(() => {
        axios.get(`${apiUrl}/orders/todas`)
            .then(res => setOrdenes(res.data))
            .catch(err => console.error('Error al obtener las órdenes:', err));
    }, []);

    const toggleDetalles = (id) => {
        setOrdenActiva(prev => (prev === id ? null : id));
    };

    return (
        <div className="historial-container">
            <h2 className="historial-titulo">Historial de Compras</h2>
            <table className="tabla-compras">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Cliente</th>
                        <th>Email</th>
                        <th>Dirección</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Productos</th>
                        <th>Detalle</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenes.map((orden, index) => (
                        <>
                            <tr key={orden._id}>
                                <td>{index + 1}</td>
                                <td>{orden.nombre}</td>
                                <td>{orden.email}</td>
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
                                    <td colSpan="9">
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
                                                {orden.productos.map((prod, idx) => (
                                                    <tr key={idx}>
                                                        <td>{prod.nombre}</td>
                                                        <td>${prod.precio.toFixed(2)}</td>
                                                        <td>{prod.quantity}</td>
                                                        <td>${(prod.precio * prod.quantity).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistorialCompras;