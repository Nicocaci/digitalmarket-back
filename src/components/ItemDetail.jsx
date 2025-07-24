import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/ItemDetail.css';
import { useCart } from '../context/CartContext.jsx';


const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlUD = import.meta.env.VITE_API_URL_UPLOADS;

const ItemDetail = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [cantidades, setCantidades] = useState([]);
    const navigate = useNavigate();

    const { addProductToCart } = useCart();

    useEffect(() => {
        axios.get(`${apiUrl}/productos/${id}`)
            .then(res => {
                console.log("Producto obtenido:", res.data); // 👈
                setProducto(res.data);
            })
            .catch(err => console.error('Error al obtener productos:', err));
    }, [id]);

    const handleAddToCart = (productId) => {
        const cantidad = cantidades[productId] || 1;
        const pesoTotal = cantidad * producto.peso;

        addProductToCart(producto, pesoTotal); // 👈 le pasás el producto y el peso total
    };



    const handleCantidadChange = (productId, value) => {
        const cantidad = parseInt(value);
        if (!isNaN(cantidad) && cantidad > 0) {
            setCantidades(prev => ({
                ...prev,
                [productId]: cantidad
            }));
        }
    };

    if (!producto) return <div>Cargando producto...</div>;

    return (
        <div className='seccion-detalle'>
            <div className='card-detalle'>
                <button onClick={() => navigate('/productos')} className='back-button'>
                    ← Volver a Productos
                </button>
                <div className='card-detail-container'>
                    <div className='img-container'>
                        <img className='img-detalle' src={`${apiUrlUD}/uploads/${producto.imagen[0]}`} alt={producto.nombre} />
                    </div>
                    <div className='card-detail'>
                        <h2>{producto.nombre}</h2>
                        <p><strong>SKU:</strong> {producto._id}</p>
                        <p><strong>Categoría:</strong> {producto.categoria}</p>
                        <p><strong>Peso Unitario:</strong> {producto.peso} KG.</p>
                        <p><strong>Precio por KG:</strong> ${(producto.precio * 1.305).toFixed(2)}</p>
                        <p><strong>Precio por KG MAYORISTA*:</strong> ${(producto.precio * 1.205).toFixed(2)}</p>
                        <p><strong>Nota:</strong> {producto.descripcion}</p>
                        <p className='cantidad'><strong>Unidades</strong></p>
                        <div className="cantidad-container">
                            <button onClick={() => handleCantidadChange(producto._id, (cantidades[producto._id] || 1) - 1)}>-</button>
                            <span>{cantidades[producto._id] || 1}</span>
                            <button onClick={() => handleCantidadChange(producto._id, (cantidades[producto._id] || 1) + 1)}>+</button>
                        </div>
                        <div className='subtotal-container'>
                            <strong>Subtotal:</strong>
                            <span className='subtotal'>
                                ${(producto.precio * 1.305 * (cantidades[producto._id] || 1) * producto.peso).toFixed(2)}
                            </span>
                        </div>

                        <button onClick={() => handleAddToCart(producto._id, 1)}>Añadir al carrito</button>
                    </div>
                </div>
            </div>
            <div className='info-mayorista'>
                <p><strong>*PRECIO MAYORISTA: UNA VEZ QUE EL CARRITO ALCANZA LOS 10KG DE CUALQUIER PRODUCTO, EMPIEZA A CALCULAR PRECIO MAYORISTA </strong></p>
            </div>
        </div>

    );
};

export default ItemDetail;
