import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/ItemDetail.css';

const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlUD = import.meta.env.VITE_API_URL_UPLOADS;

const ItemDetail = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${apiUrl}/productos/${id}`)
            .then(res => {
                console.log("Producto obtenido:", res.data); // 👈
                setProducto(res.data);
            })
            .catch(err => console.error('Error al obtener productos:', err));
    }, [id]);

    if (!producto) return <div>Cargando producto...</div>;

    return (
        <div className='seccion-detalle'>
            <div className='card-detalle'>
                <button onClick={() => navigate('/productos')} style={{ marginTop: '1rem' }}>
                    ← Volver a Productos
                </button>
                <img className='img-detalle' src={`${apiUrlUD}/uploads/${producto.imagen[0]}`} alt={producto.nombre} />
                <div className='card-content'>
                    <h2>{producto.nombre}</h2>
                    <p><strong>Precio:</strong> ${producto.precio}</p>
                    <p><strong>Categoría:</strong> {producto.categoria}</p>
                    <p><strong>Stock:</strong> {producto.stock}</p>
                </div>
                <button>Añadir al carrito</button>
            </div>
        </div>
    );
};

export default ItemDetail;
