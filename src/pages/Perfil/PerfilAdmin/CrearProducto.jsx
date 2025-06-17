import React from 'react';
import { useState } from 'react';
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
        stock: "",
    })


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            imagen: Array.from(e.target.files)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: "¿Confirmar subasta?",
            text: "¿Estás seguro de que deseas crear esta subasta?",
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
                formDataToSend.append("stock", formData.stock);


                try {
                    await axios.post(`${apiUrl}/productos`,
                        formDataToSend,
                        { headers: { "Content-type": "multipart/form-data" } }
                    );
                    Swal.fire({
                        title: "Subasta creada",
                        text: "¡Tu subasta ha sido publicada con éxito!",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                    });

                    setFormData({
                        nombre: "",
                        categoria: "",
                        imagen: "",
                        precio: "",
                        stock: "",
                    })
                } catch (error) {
                    console.error("Error:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al crear la subasta",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            }
        })
    };

    return (
        <form onSubmit={handleSubmit} className='crearProducto'>
            <h2>Crear Producto</h2>
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
                placeholder='Categoria del producto'
                value={formData.categoria}
                onChange={handleChange}
                required />

            <input
                type="file"
                name="imagen"
                className='input-upload'
                accept="image/*"
                multiple
                onChange={handleImageChange}
                required
            />
            </div>
            <div className='grid-productos'>
            <input
                type="number"
                name="precio"
                className='input-crear'
                placeholder='Precio $$'
                value={formData.precio}
                onChange={handleChange} />
            <input
                type="number"
                name='stock'
                className='input-crear'
                placeholder='Stock'
                value={formData.stock}
                onChange={handleChange}
                required />
            </div>

            <div className='btn-flex'>
            <button type="submit" className="btn-crear">
                Crear Producto
            </button>
            </div>
        </form>
    )
}

export default CrearProducto