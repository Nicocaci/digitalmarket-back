import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../../css/Perfil/PerfilAdmin.css';

const apiUrl = import.meta.env.VITE_API_URL;

const CrearProducto = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        categoria: "",
        imagen: "",
        precio: "",
        peso: "",
        descripcion: "",
    });

    const [fileNames, setFileNames] = useState([]); // para mostrar los nombres

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            imagen: files
        }));
        setFileNames(files.map(file => file.name));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: "¿Confirmar producto?",
            text: "¿Estás seguro de que deseas crear este producto?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, crear",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const formDataToSend = new FormData();
                formDataToSend.append("nombre", formData.nombre);
                formDataToSend.append("categoria", formData.categoria);
                formData.imagen.forEach((file) => {
                    formDataToSend.append("imagen", file);
                });
                formDataToSend.append("precio", formData.precio);
                formDataToSend.append("peso", formData.peso);
                formDataToSend.append("descripcion", formData.descripcion);

                try {
                    await axios.post(`${apiUrl}/productos`,
                        formDataToSend,
                        { headers: { "Content-type": "multipart/form-data" } }
                    );
                    Swal.fire({
                        title: "Producto creado",
                        text: "¡Tu Producto fue creado con éxito!",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                    });

                    setFormData({
                        nombre: "",
                        categoria: "",
                        imagen: "",
                        precio: "",
                        peso: "",
                        descripcion: "",
                    });
                    setFileNames([]);
                } catch (error) {
                    console.error("Error:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al crear el producto",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className='crearProducto'>
            <h2 className='titulos-admin'>Crear Producto</h2>
            <div className='grid-productos'>
                <input
                    type="text"
                    name='nombre'
                    className='input-crear'
                    placeholder='Nombre del producto'
                    value={formData.nombre}
                    onChange={handleChange}
                    required />

                <input
                    type="text"
                    name='categoria'
                    className='input-crear'
                    placeholder='Categoría del producto'
                    value={formData.categoria}
                    onChange={handleChange}
                    required />

                <input
                    type="text"
                    name='descripcion'
                    className='input-crear'
                    placeholder='Nota'
                    value={formData.descripcion}
                    onChange={handleChange}
                    required />
                                    <input
                    type="number"
                    name="peso"
                    className='input-crear'
                    placeholder='Peso Unitario'
                    value={formData.peso}
                    onChange={handleChange} />
            </div>
            <div className='grid-productos'>
                <input
                    type="number"
                    name="precio"
                    className='input-crear'
                    placeholder='Precio $$'
                    value={formData.precio}
                    onChange={handleChange} />


                {/* Botón personalizado para input file */}
                <div>
                    <label htmlFor="imagen" className="custom-file-label">
                        Subir imagen
                    </label>
                    <input
                        type="file"
                        id="imagen"
                        name="imagen"
                        className="hidden-input"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        required
                    />
                    {/* Mostrar nombre de archivos seleccionados */}
                    {fileNames.length > 0 && (
                        <div className="file-names">
                            {fileNames.map((name, index) => (
                                <div key={index}>{name}</div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className='btn-flex'>
                <button type="submit" className="btn-crear">
                    Crear Producto
                </button>
            </div>
        </form>
    );
};

export default CrearProducto;
