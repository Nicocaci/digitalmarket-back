import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import '../../../css/Perfil/Pedidos.css';

const apiUrl = import.meta.env.VITE_API_URL;

const Pedidos = () => {
    const [userId, setUserId] = useState(null);
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Decodificamos el token para obtener el userId
    useEffect(() => {
        const token = Cookies.get('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded._id);
            } catch (err) {
                console.error('Error al decodificar el token:', err);
            }
        }
    }, []);

    // Una vez que tenemos el userId, pedimos las órdenes
    useEffect(() => {
        if (userId) {
            fetchOrder();
        }
    }, [userId]);

    const fetchOrder = async () => {
        try {
            const response = await axios.get(`${apiUrl}/orders/usuario/${userId}`);
            console.log('Pedidos recibidos:', response.data);
            setOrderData(response.data.ordenes); // ✅ Corregido: acceder al array real
        } catch (error) {
            console.error('Error al obtener la orden', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='scroll-pedidos'>
            <h1 className="titulo-tabla-usuario">Mis pedidos</h1>
            <div className="seccion-form">
                <table className="tabla-pedidos " >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Fecha</th>
                            <th>Productos</th>
                            <th>Total</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6">Cargando pedidos...</td>
                            </tr>
                        ) : orderData.length > 0 ? (
                            orderData.map((order, index) => (
                                <tr key={order._id}>
                                    <td>{index + 1}</td>
                                    <td>{order.nombre || 'Sin nombre'}</td>
                                    <td>{new Date(order.fecha).toLocaleDateString()}</td>
                                    <td>
                                        <ul className='li-none'>
                                            {order.productos.map((prod, i) => (
                                                <li key={i}>
                                                    {prod.nombre} x{prod.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>${order.total}</td>
                                    <td>{order.estado}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>
                                    No hay pedidos realizados aún.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Pedidos;
