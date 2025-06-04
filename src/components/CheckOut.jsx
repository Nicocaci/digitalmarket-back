import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../css/Checkout.css';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const CheckOut = () => {
    const { cart, total, clearCart } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        direccion: '',
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/orders/crear-orden`, {
                nombre: formData.nombre,
                email: formData.email,
                direccion: formData.direccion,
                productos: cart.map(item => ({
                    productId: item._id || item.product._id,
                    nombre: item.product.nombre,
                    precio: item.product.precio,
                    quantity: item.quantity
                })),
                total
            });
            // 2. Crear preferencia en Mercado Pago
            const mercadoPagoResponse = await axios.post(`${apiUrl}/mercado-pago/crear-orden`, {
                productos: cart.map(item => ({
                    nombre: item.product.nombre,
                    precio: item.product.precio,
                    quantity: item.quantity
                })),
                nombre: formData.nombre,
                email: formData.email
            });

            // 3. Redirigir al checkout de Mercado Pago
            window.location.href = mercadoPagoResponse.data.init_point;
        } catch (error) {
            console.error('Error en el checkout:', error);
            alert('Ocurrió un error al procesar tu compra. Intentalo más tarde.');
        }
    }

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>

            <div className="checkout-section">
                <h3>Resumen de tu pedido</h3>
                <ul>
                    {cart.map(item => (
                        <li key={item._id}>
                            {item.product.nombre} x{item.quantity} - ${item.product.precio * item.quantity}
                        </li>
                    ))}
                </ul>
                <h4>Total: ${total.toFixed(2)}</h4>
            </div>

            <div className="checkout-section">
                <h3>Datos del comprador</h3>
                <form onSubmit={handleSubmit} className="checkout-form">
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="direccion"
                        placeholder="Dirección"
                        value={formData.direccion}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Finalizar compra</button>
                </form>
            </div>
        </div>
    );
};

export default CheckOut;