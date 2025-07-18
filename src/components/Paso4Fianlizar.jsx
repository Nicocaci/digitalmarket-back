import axios from 'axios';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlUD = import.meta.env.VITE_API_URL_UPLOADS;

const Paso4Finalizar = ({ formData, cart, total, prevStep }) => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const cartConRecargo = cart.map(item => {
    const precioConRecargo = item.product.precio * 1.305;
    return {
      ...item,
      precioConRecargo,
      subtotal: precioConRecargo * item.quantity
    };
  });

  const totalConRecargo = cartConRecargo.reduce((acc, item) => acc + item.subtotal, 0);

  const handleConfirmarCompra = async () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    try {
      // Crear orden en tu base de datos
      await axios.post(`${apiUrl}/orders/crear-orden`, {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        metodoPago: formData.metodoPago,
        productos: cartConRecargo.map(item => ({
          productId: item._id || item.product._id,
          nombre: item.product.nombre,
          precio: item.precioConRecargo,
          quantity: item.quantity
        })),
        total: totalConRecargo
      }, {
        withCredentials: true
      });

      if (formData.metodoPago === 'mercado_pago') {
        const mercadoPagoResponse = await axios.post(`${apiUrl}/mercado-pago/crear-orden`, {
          productos: cartConRecargo.map(item => ({
            nombre: item.product.nombre,
            precio: item.precioConRecargo,
            quantity: item.quantity
          })),
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono
        });

        window.location.href = mercadoPagoResponse.data.init_point;
      } else {
        const nuevaOrden = {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion,
          metodoPago: formData.metodoPago,
          productos: cartConRecargo.map(item => ({
            nombre: item.product.nombre,
            precio: item.precioConRecargo,
            quantity: item.quantity
          })),
          total: totalConRecargo
        };

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
      <p><strong>Teléfono:</strong> {formData.telefono}</p>
      <p><strong>Dirección:</strong> {formData.direccion}</p>
      <p><strong>Método de Pago:</strong> {formData.metodoPago === 'mercado_pago' ? 'Mercado Pago' : 'Efectivo'}</p>

      <ul className="li-none">
        {cartConRecargo.map(item => (
          <li key={item._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img src={`${apiUrlUD}/uploads/${item.product.imagen}`} alt={item.product?.nombre} style = {{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '10px', borderRadius: '8px' }} />
            <span>{item.product.nombre} x{item.quantity} - ${item.subtotal.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <h4 className='font-total'>Total: ${totalConRecargo.toFixed(2)}</h4>

      <div className="btn-checkout">
        <button onClick={prevStep}>Atrás</button>
        <button onClick={handleConfirmarCompra}>
          Confirmar y {formData.metodoPago === 'mercado_pago' ? 'Pagar' : 'Finalizar'}
        </button>
      </div>
    </div>
  );
};

export default Paso4Finalizar;
