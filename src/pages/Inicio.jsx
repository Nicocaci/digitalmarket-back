import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Inicio.css';
import { useCart } from '../context/CartContext.jsx';



const Inicio = () => {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [cantidades, setCantidades] = useState([]);

    const { addProductToCart } = useCart();

    useEffect(() => {
        fetchProductos();
    }, []);

    const handleAddToCart = (productId) => {
        const cantidad = cantidades[productId] || 1;
        addProductToCart(productId, cantidad);
    };

    const fetchProductos = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/productos");
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
        <section className='inicio'>
            <h1 className='title'>Lista de Productos
            </h1>

            <div className='filter'>
                <h3>Filtrar por Categoría:</h3>
                <div className='filter2'>
                    <label>
                        <input
                            type="checkbox"
                            value="salames"
                            onChange={handleCategoryChange}
                        /> Salames
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="jamon"
                            onChange={handleCategoryChange}
                        /> Jamón
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="mortadela"
                            onChange={handleCategoryChange}
                        /> Mortadela
                    </label>
                    <label>
                        <input type="checkbox"
                            value="jamon-cocido"
                            onChange={handleCategoryChange}
                        /> Jamón Cocido
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="jamon-crudo"
                            onChange={handleCategoryChange}
                        /> Jamón Crudo
                    </label>
                </div>
            </div>

            <div className='container2'>
                <div className="container">
                    {filtrarProductos().length > 0 ? (
                        filtrarProductos().map((prod) => (
                            <div key={prod._id} className="card">
                                <img src={`http://localhost:3000/uploads/${prod.imagen}`} alt={prod.nombre} />
                                <div className="card-content">
                                    <h1>{prod.nombre}</h1>
                                    <h2 className="price">$ {(prod.precio * 1.305).toFixed(2)}</h2>
                                    <p>Precio por kg..</p>
                                    <div className='contenido-inicio1'>
                                    <div>
                                    <input
                                        type="number"
                                        min="1"
                                        value={cantidades[prod._id] || 1}
                                        onChange={(e) => handleCantidadChange(prod._id, e.target.value)}
                                        style={{ width: '60px', marginBottom: '10px' }}
                                    />
                                    </div>
                                    <div>
                                    <button className='btn-agregar' onClick={() => handleAddToCart(prod._id, 1)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart-plus" viewBox="0 0 16 16">
                                        <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z" />
                                        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                    </svg>
                                    </button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay productos disponibles.</p>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Inicio;
