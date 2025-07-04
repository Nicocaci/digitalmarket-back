import axios from 'axios';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const Paso4Finalizar = ({ formData, cart, total, prevStep }) => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const handleConfirmarCompra = async () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    try {
      // 1. Crear orden en tu base de datos
await axios.post(`${apiUrl}/orders/crear-orden`, {
  nombre: formData.nombre,
  email: formData.email,
  direccion: formData.direccion,
  metodoPago: formData.metodoPago,
  productos: cart.map(item => ({
    productId: item._id || item.product._id,
    nombre: item.product.nombre,
    precio: item.product.precio,
    quantity: item.quantity
  })),
  total
}, {
  withCredentials: true // 👈 ESTO ES LO QUE FALTABA
});


      if (formData.metodoPago === 'mercado_pago') {
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

        window.location.href = mercadoPagoResponse.data.init_point;
      } else {
        const nuevaOrden = {
          nombre: formData.nombre,
          email: formData.email,
          direccion: formData.direccion,
          metodoPago: formData.metodoPago,
          productos: cart.map(item => ({
            nombre: item.product.nombre,
            precio: item.product.precio,
            quantity: item.quantity
          })),
          total
        };

        // 3. Compra en efectivo: redirigimos al "gracias"
        clearCart();
        navigate('/gracias', { state: { orden: nuevaOrden } });
      }
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      alert('Ocurrió un error al procesar tu compra.');
    }
  };

  return (
    <div className="checkout-form">
      <h3>Resumen Final</h3>
      <p><strong>Nombre:</strong> {formData.nombre}</p>
      <p><strong>Email:</strong> {formData.email}</p>
      <p><strong>Dirección:</strong> {formData.direccion}</p>
      <p><strong>Método de Pago:</strong> {formData.metodoPago === 'mercado_pago' ? 'Mercado Pago' : 'Efectivo'}</p>

      <ul>
        {cart.map(item => (
          <li key={item._id}>
            {item.product.nombre} x{item.quantity} - ${item.product.precio * item.quantity}
          </li>
        ))}
      </ul>

      <h4>Total: ${total.toFixed(2)}</h4>

      <div className="checkout-buttons">
        <button onClick={prevStep}>Atrás</button>
        <button onClick={handleConfirmarCompra}>Confirmar y {formData.metodoPago === 'mercado_pago' ? 'Pagar' : 'Finalizar'}</button>
      </div>
    </div>
  );
};

export default Paso4Finalizar;
