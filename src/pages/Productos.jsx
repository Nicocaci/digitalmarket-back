import React from 'react';
import '../css/Productos.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlUD = import.meta.env.VITE_API_URL_UPLOADS;


const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

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
        }
    }

    // Extraer categorías únicas
    const categorias = [...new Set(productos.map(p => p.categoria))];

    // Filtrar productos por nombre y categoría
    const productosFiltrados = productos.filter((prod) => {
        const nombreCoincide = prod.nombre.toLowerCase().includes(filtro.toLowerCase());
        const categoriaCoincide = categoriaSeleccionada === '' || prod.categoria === categoriaSeleccionada;
        return nombreCoincide && categoriaCoincide;
    });


    return (
        <div className='page-productos'>
            <h1 className='titulo-productos'>Productos</h1>
            <div className='filtro-busqueda center'>
                <input
                    type="text"
                    placeholder="Buscar producto por nombre..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />

                <select
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    style={{ marginLeft: '1rem' }}
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map((cat, idx) => (
                        <option  key={idx} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div className='container-productos'>
                {productosFiltrados.map((prod, index) => (
                    <Link key={prod._id} to={`/productos/${prod._id}`} className="card-link">
                    <div key={prod._id} className='card card-productos'>
                        <img className='' src={`${apiUrlUD}/uploads/${prod.imagen}`} alt={prod.nombre} />
                        <div className='card-content'>
                            <h1>{prod.nombre}</h1>
                            <h2 className='precio'>${(prod.precio * 1.305).toFixed(2)}</h2>
                        </div>
                    </div>
                    </Link>
                ))}
            </div>
        </div>

    )
}

export default Productos;