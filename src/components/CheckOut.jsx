import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../css/Checkout.css';

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
    const handleSubmit = (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }

        // Podés enviar estos datos a un backend en el futuro
        console.log('Compra confirmada:\n', JSON.stringify({
            datosComprador: formData,
            productos: cart,
            total
        }, null, 2));

        alert(`¡Gracias por tu compra, ${formData.nombre}!`);
        clearCart();
        navigate('/'); // redirige al inicio o donde prefieras
    };

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