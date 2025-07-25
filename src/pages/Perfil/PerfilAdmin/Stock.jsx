import React, { useState, useEffect } from 'react';
import '../../../css/Perfil/Stock.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlUD = import.meta.env.VITE_API_URL_UPLOADS;

const Stock = () => {
    const [productos, setProductos] = useState([]);
    const [productoEditando, setProductoEditando] = useState(null);
    const [form, setForm] = useState({
        nombre: '',
        categoria: '',
        precio: '',
        peso: '',
        descripcion: '',
        imagen: null
    });
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
            peso: producto.peso,
            descripcion: producto.descripcion,
            imagen: null
        });
    };

    const handleEliminar = async (id) => {
        const resultado = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el producto de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (resultado.isConfirmed) {
            try {
                await axios.delete(`${apiUrl}/productos/${id}`);
                await fetchProductos();
                Swal.fire({
                    title: 'Eliminado',
                    text: 'El producto fue eliminado exitosamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error("Error al eliminar el producto", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al eliminar el producto.',
                    icon: 'error'
                });
            }
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGuardar = async () => {
        try {
            const formData = new FormData();
            formData.append('nombre', form.nombre);
            formData.append('categoria', form.categoria);
            formData.append('precio', form.precio);
            formData.append('peso', form.peso);
            formData.append('descripcion', form.descripcion);
            if (form.imagen) {
                formData.append('imagen', form.imagen);
            }

            await axios.put(`${apiUrl}/productos/${productoEditando}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setProductoEditando(null);
            await fetchProductos();
        } catch (error) {
            console.error("Error al actualizar el producto", error);
            Swal.fire("Error", "No se pudo guardar el producto", "error");
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
                            <th>Peso</th>
                            <th>Precio</th>
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
                                    <td>{prod.peso} KG</td>
                                    <td>${prod.precio}</td>
                                    <td>
                                        <button className='btn-stock' onClick={() => handleEditarClick(prod)}>Editar</button>
                                        <button className='btn-eliminar-stock' onClick={() => handleEliminar(prod._id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

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
                        <label>Peso Uni:
                            <input className='input-stock' type="number" name="peso" value={form.peso} onChange={handleChange} />
                        </label>
                        <label>Precio:
                            <input className='input-stock' type="number" name="precio" value={form.precio} onChange={handleChange} />
                        </label>
                        <label>Descripcion:
                            <input className='input-stock' name="descripcion" value={form.descripcion} onChange={handleChange} />
                        </label>
                        <label>Imagen actual:
                            <img
                                src={`${apiUrlUD}/uploads/${productos.find(p => p._id === productoEditando)?.imagen}`}
                                alt="Imagen actual"
                                className="img-preview"
                            />
                        </label>
                        <label>Cambiar imagen:
                            <input
                                className='input-stock'
                                type="file"
                                accept="image/*"
                                onChange={(e) => setForm({ ...form, imagen: e.target.files[0] })}
                            />
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
