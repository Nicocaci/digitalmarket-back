import React, { useState, useEffect } from 'react';
import '../../../css/Perfil/Stock.css';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlUD = import.meta.env.VITE_API_URL_UPLOADS;

const Stock = () => {
    const [productos, setProductos] = useState([]);
    const [productoEditando, setProductoEditando] = useState(null);
    const [form, setForm] = useState({ nombre: '', categoria: '', precio: '', stock: '' });
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');


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
    };

    const handleEditarClick = (producto) => {
        setProductoEditando(producto._id);
        setForm({
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: producto.precio,
            stock: producto.stock
        });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGuardar = async () => {
        try {
            await axios.put(`${apiUrl}/productos/${productoEditando}`, form);
            setProductoEditando(null);
            await fetchProductos(); // Recargar productos
        } catch (error) {
            console.error("Error al actualizar el producto", error);
        }
    };

    const handleCancelar = () => {
        setProductoEditando(null);
    };

    return (
        <div className='seccion-productos'>
            <div><h1 className='titulos-admin'>Productos a la Venta</h1></div>
            <div className="tabla-productos">
                <div className="filtros-stock">
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        className="input-filtro"
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Buscar por categoría..."
                        className="input-filtro"
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                    />
                </div>

                <table className='tabla-compras'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Categoria</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos
                            .filter((prod) =>
                                prod.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
                                prod.categoria.toLowerCase().includes(filtroCategoria.toLowerCase())
                            )
                            .map((prod, index) => (
                                <tr key={prod._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img className='img-productos' src={`${apiUrlUD}/uploads/${prod.imagen}`} alt={prod.nombre} />
                                    </td>
                                    <td>{prod.nombre}</td>
                                    <td>{prod.categoria}</td>
                                    <td>${prod.precio}</td>
                                    <td>{prod.stock}</td>
                                    <td>
                                        <button className='btn-stock' onClick={() => handleEditarClick(prod)}>Editar</button>
                                    </td>
                                </tr>
                            ))}

                    </tbody>
                </table>
            </div>

            {/* Modal simple para editar producto */}
            {productoEditando && (
                <div className="modal-editar">
                    <div className="modal-content">
                        <h2 className='titulos-admin'>Editar Producto</h2>
                        <label>Nombre:
                            <input className='input-stock' name="nombre" value={form.nombre} onChange={handleChange} />
                        </label>
                        <label>Categoria:
                            <input className='input-stock' name="categoria" value={form.categoria} onChange={handleChange} />
                        </label>
                        <label>Precio:
                            <input className='input-stock' type="number" name="precio" value={form.precio} onChange={handleChange} />
                        </label>
                        <label>Stock:
                            <input className='input-stock' type="number" name="stock" value={form.stock} onChange={handleChange} />
                        </label>
                        <div className="modal-buttons">
                            <button className='btn-guardar-stock' onClick={handleGuardar}>Guardar</button>
                            <button className='btn-cancelar-stock' onClick={handleCancelar}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stock;
