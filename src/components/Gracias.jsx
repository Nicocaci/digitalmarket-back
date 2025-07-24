import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
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
            <motion.div
                className="gracias-card"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: 'easeOut' }}
            >
                <h2>¡Gracias por tu compra, {orden.nombre}!</h2>
                <p>Te enviamos un correo a <strong>{orden.email}</strong> con los detalles del pedido.</p>

                <div className="gracias-resumen">
                    <h3>Resumen del pedido</h3>
                    <ul>
                        {orden.productos.map((item, index) => {
                            const pesoUnitario = item.peso;
                            const cantidadEnKg = item.quantity;
                            const unidades = pesoUnitario > 0
                                ? Math.round(cantidadEnKg / pesoUnitario)
                                : 1;

                            const pesoTotal = cantidadEnKg.toFixed(2); // peso total ya viene en quantity

                            // Precio por kg: podés ajustar según lógica de mayorista si querés
                            const precioPorKg = item.precio;
                            const subtotal = (precioPorKg * cantidadEnKg);

                            return (
                                <li key={index}>
                                    {item.nombre} - {unidades} unidad{unidades !== 1 ? 'es' : ''} ({pesoTotal} kg) - ${subtotal}
                                </li>
                            );
                        })}
                    </ul>

                    <h4 className="font-total">Total: ${orden.total.toFixed(2)}</h4>
                </div>

                <button className="gracias-boton" onClick={() => navigate('/')}>
                    Seguir comprando
                </button>
            </motion.div>
        </div>
    );
};

export default Gracias;
