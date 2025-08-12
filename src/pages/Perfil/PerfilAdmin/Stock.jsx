import React, { useState, useEffect, useMemo } from 'react';
import '../../../css/Perfil/Stock.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Registrar módulos de AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

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
            setProductos(Array.isArray(response.data) ? response.data : []);
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
                Swal.fire("Error", "Hubo un problema al eliminar el producto.", "error");
            }
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGuardar = async () => {
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value !== null) formData.append(key, value);
            });

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

    const handleCancelar = () => setProductoEditando(null);

    const columnDefs = useMemo(() => [
        { headerName: "#", valueGetter: "node.rowIndex + 1", width: 70 },
        {
            headerName: "Imagen",
            field: "imagen",
            cellRenderer: (params) => {
                const imgSrc = params.value ? `${apiUrlUD}/uploads/${params.value}` : "/no-image.png";
                return (
                    <img
                        src={imgSrc}
                        alt="producto"
                        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 5 }}
                    />
                );
            },
            width: 100
        },
        { headerName: "Nombre", field: "nombre", sortable: true, filter: true },
        {
            headerName: "Categoría",
            valueGetter: (params) => params.data.categoria?.nombre || '',
            sortable: true,
            filter: true
        },
        { headerName: "Peso (KG)", field: "peso", sortable: true, width: 120 },
        { headerName: "Precio", field: "precio", sortable: true, width: 120 },
        {
            headerName: "Acciones",
            cellRenderer: (params) => (
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button className='btn-stock' onClick={() => handleEditarClick(params.data)}>Editar</button>
                    <button className='btn-eliminar-stock' onClick={() => handleEliminar(params.data._id)}>Eliminar</button>
                </div>
            ),
            width: 200
        }
    ], [productos]);


    const productosFiltrados = useMemo(() => {
        return productos.filter((prod) =>
            prod.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
            prod.categoria.toLowerCase().includes(filtroCategoria.toLowerCase())
        );
    }, [productos, filtroNombre, filtroCategoria]);

    return (
        <div className='seccion-productos'>
            <h1 className='titulos-admin'>Productos a la Venta</h1>

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

            {/* Tabla AG Grid */}
            <div className="ag-theme-alpine" style={{ height: 350, width: '100%' }}>
                <AgGridReact
                    rowData={productosFiltrados}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={false}
                />
            </div>

            {/* Modal de edición */}
            {productoEditando && (
                <div className="modal-editar">
                    <div className="modal-content">
                        <h2 className='titulos-admin'>Editar Producto</h2>
                        <label>Nombre:
                            <input className='input-stock' name="nombre" value={form.nombre} onChange={handleChange} />
                        </label>
                        <label>Categoría:
                            <input className='input-stock' name="categoria" value={form.categoria} onChange={handleChange} />
                        </label>
                        <label>Peso Uni:
                            <input className='input-stock' type="number" name="peso" value={form.peso} onChange={handleChange} />
                        </label>
                        <label>Precio:
                            <input className='input-stock' type="number" name="precio" value={form.precio} onChange={handleChange} />
                        </label>
                        <label>Descripción:
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
