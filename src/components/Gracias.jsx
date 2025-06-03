import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../css/Gracias.css';

const Gracias = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orden = location.state?.orden;

    useEffect(() => {
        if (!orden) {
            navigate('/');
        }
    }, [orden, navigate]);

    if (!orden) return null;

    return (
        <div className="gracias-container">
            <h2>¡Gracias por tu compra, {orden.nombre}!</h2>
            <p>Te enviamos un correo a <strong>{orden.email}</strong> con los detalles.</p>

            <h3>Resumen del pedido:</h3>
            <ul>
                {orden.productos.map((item, index) => (
                    <li key={index}>
                        {item.nombre} x{item.quantity} - ${item.precio * item.quantity}
                    </li>
                ))}
            </ul>
            <h4>Total: ${orden.total.toFixed(2)}</h4>
        </div>
    );
};

export default Gracias;
