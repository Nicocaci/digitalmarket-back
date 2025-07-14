import React from 'react';
import '../css/Inicio.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import axios from 'axios';
import { Link } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlUD = import.meta.env.VITE_API_URL_UPLOADS;

const ProductoDestacado = () => {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [cantidades, setCantidades] = useState([]);

    const { addProductToCart } = useCart();

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await axios.get(`${apiUrl}/productos`);
            if (Array.isArray(response.data)) {
                setProductos(response.data);
            } else {
                console.error("La API no devolvió un array", response.data);
                setProductos([]);
            }
        } catch (error) {
            console.error("Error al obtener los productos", error);
            setError("Error al obtener los productos");
        }
    };





    const handleAddToCart = (productId) => {
        const cantidad = cantidades[productId] || 1;
        addProductToCart(productId, cantidad);
    };



    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;

        if (checked) {
            setCategoriasSeleccionadas([...categoriasSeleccionadas, value]);
        } else {
            setCategoriasSeleccionadas(categoriasSeleccionadas.filter((cat) => cat !== value));
        }
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

    const filtrarProductos = () => {
        if (categoriasSeleccionadas.length === 0) return productos;
        return productos.filter((prod) =>
            categoriasSeleccionadas.includes(prod.categoria)
        );
    };


    return (
        <div>
            <div className='center'>
                <div className='seccion-descuento'>
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={3}
                        navigation
                        autoplay={{
                            delay: 3000,       // tiempo entre slides (milisegundos)
                            disableOnInteraction: false // sigue funcionando aunque el usuario interactúe
                        }}
                        breakpoints={{
                            320: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                    >

                        {productos.map((prod) => (
                            <SwiperSlide key={prod._id}>
                                <Link key={prod._id} to={`/productos/${prod._id}`} className="card-link" >
                                <div className="card">
                                    <img src={`${apiUrlUD}/uploads/${prod.imagen}`} alt={prod.nombre} />
                                    <div className="card-content">
                                        <h1>{prod.nombre}</h1>
                                        <h2 className="price">
                                            <span >
                                                $ {(prod.precio * 1.305).toFixed(2)}
                                            </span>
                                        </h2>
                                    </div>
                                </div>
                                </Link>
                            </SwiperSlide>
                        ))}

                    </Swiper>
                </div>
            </div></div>
    )
}

export default ProductoDestacado;