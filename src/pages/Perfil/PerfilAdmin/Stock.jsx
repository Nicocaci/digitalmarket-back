import React, { useState, useEffect } from 'react';
import '../../../css/Perfil/Stock.css';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlUD = import.meta.env.VITE_API_URL_UPLOADS;

const Stock = () => {
    const [productos, setProductos] = useState([]);
    const [productoEditando, setProductoEditando] = useState(null);
    const [form, setForm] = useState({ nombre: '', categoria: '', precio: '', stock: '' });

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
            <div><h1>Productos a la Venta</h1></div>
            <div className="">
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
                        {productos.map((prod, index) => (
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
                                    <button onClick={() => handleEditarClick(prod)}>Editar</button>
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
                        <h2>Editar Producto</h2>
                        <label>Nombre:
                            <input name="nombre" value={form.nombre} onChange={handleChange} />
                        </label>
                        <label>Categoria:
                            <input name="categoria" value={form.categoria} onChange={handleChange} />
                        </label>
                        <label>Precio:
                            <input type="number" name="precio" value={form.precio} onChange={handleChange} />
                        </label>
                        <label>Stock:
                            <input type="number" name="stock" value={form.stock} onChange={handleChange} />
                        </label>
                        <div className="modal-buttons">
                            <button onClick={handleGuardar}>Guardar</button>
                            <button onClick={handleCancelar}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stock;
