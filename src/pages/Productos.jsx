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
    const [mostrarFiltros, setMostrarFiltros] = useState(false); // 👈 nuevo

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

    const categorias = [...new Set(productos.map(p => p.categoria))];

    const productosFiltrados = productos.filter((prod) => {
        const nombreCoincide = prod.nombre.toLowerCase().includes(filtro.toLowerCase());
        const categoriaCoincide = categoriaSeleccionada === '' || prod.categoria === categoriaSeleccionada;
        return nombreCoincide && categoriaCoincide;
    });

    return (
        <div className="page-productos">
            <h1 className="titulo-productos">Productos</h1>
            {/* Botón visible solo en móviles */}


            {/* Panel lateral */}
            <div className={`sidebar-filtros panel-deslizable ${mostrarFiltros ? 'mostrar' : ''}`}>
                <button className="cerrar-filtros" onClick={() => setMostrarFiltros(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        fill="white"
                        className="bi bi-arrow-right"
                        viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                    </svg></button>
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="input-busqueda"
                />
                <ul className="lista-categorias">
                    <li
                        className={categoriaSeleccionada === '' ? 'activa' : ''}
                        onClick={() => setCategoriaSeleccionada('')}
                    >
                        Todas las categorías
                    </li>
                    {categorias.map((cat, idx) => (
                        <li
                            key={idx}
                            className={categoriaSeleccionada === cat ? 'activa' : ''}
                            onClick={() => setCategoriaSeleccionada(cat)}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="productos-layout">
                <button className="btn-filtros-movil" onClick={() => setMostrarFiltros(true)}>
                    <h4>Filtrar Por:</h4>
                </button>
                {/* Sidebar fija en desktop */}
                <aside className="sidebar-filtros desktop-only">
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="input-busqueda"
                    />
                    <ul className="lista-categorias">
                        <li
                            className={categoriaSeleccionada === '' ? 'activa' : ''}
                            onClick={() => setCategoriaSeleccionada('')}
                        >
                            Todas las categorías
                        </li>
                        {categorias.map((cat, idx) => (
                            <li
                                key={idx}
                                className={categoriaSeleccionada === cat ? 'activa' : ''}
                                onClick={() => setCategoriaSeleccionada(cat)}
                            >
                                {cat}
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className="container-productos">
                    {productosFiltrados.map((prod) => (
                        <Link key={prod._id} to={`/productos/${prod._id}`} className="card-link">
                            <div className="card card-productos">
                                <img src={`${apiUrlUD}/uploads/${prod.imagen}`} alt={prod.nombre} />
                                <div className="card-content">
                                    <h1>{prod.nombre}</h1>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Productos;
