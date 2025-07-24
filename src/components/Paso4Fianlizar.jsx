import axios from 'axios';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlUD = import.meta.env.VITE_API_URL_UPLOADS;

const Paso4Finalizar = ({ formData, cart, total, prevStep }) => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  // Calcular el total de kilos en el carrito
  const totalKilos = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Agregar recargo o descuento mayorista según el peso total
  const cartConRecargo = cart.map(item => {
    const precioBase = item.product.precio;
    let precioFinal;

    if (totalKilos >= 10) {
      precioFinal = precioBase * 1.205; // Precio mayorista
    } else {
      precioFinal = precioBase * 1.305; // Precio normal con recargo
    }

    return {
      ...item,
      precioFinal,
      subtotal: precioFinal * item.quantity
    };
  });

  const totalConRecargo = cartConRecargo.reduce((acc, item) => acc + item.subtotal, 0);

  const handleConfirmarCompra = async () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    try {
      // Crear orden en el backend
      await axios.post(`${apiUrl}/orders/crear-orden`, {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        metodoPago: formData.metodoPago,
        productos: cartConRecargo.map(item => ({
          productId: item._id || item.product._id,
          nombre: item.product.nombre,
          precio: item.precioFinal,
          peso: item.product.peso,
          quantity: item.quantity
        })),
        total: totalConRecargo
      }, {
        withCredentials: true
      });

      // Si es pago por Mercado Pago
      if (formData.metodoPago === 'mercado_pago') {
        const mercadoPagoResponse = await axios.post(`${apiUrl}/mercado-pago/crear-orden`, {
          productos: cartConRecargo.map(item => ({
            nombre: item.product.nombre,
            precio: item.precioFinal,
            peso: item.product.peso,
            quantity: item.quantity
          })),
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono
        });

        window.location.href = mercadoPagoResponse.data.init_point;
      } else {
        // Pago en efectivo
        const nuevaOrden = {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion,
          metodoPago: formData.metodoPago,
          productos: cartConRecargo.map(item => ({
            nombre: item.product.nombre,
            precio: item.precioFinal,
            peso: item.product.peso,
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
      <p><strong>Total de Kilos:</strong> {totalKilos} kg</p>

      {totalKilos >= 10 && (
        <p style={{ color: 'green', fontWeight: 'bold' }}>💰 Precio mayorista aplicado por superar los 10kg.</p>
      )}

      <ul className="li-none">
        {cartConRecargo.map(item => {
          const pesoUnidad = item.product.peso; // en kg
          const unidades = pesoUnidad
            ? Math.round(item.quantity / pesoUnidad)
            : item.quantity;
          const pesoTotal = (pesoUnidad * unidades).toFixed(2);

          return (
            <li
              key={item._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px'
              }}
            >
              <img
                src={`${apiUrlUD}/uploads/${item.product.imagen}`}
                alt={item.product?.nombre}
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  marginRight: '10px',
                  borderRadius: '8px'
                }}
              />
              <span className='detalle-compra'>
                {item.product.nombre} - {unidades} unidad{unidades !== 1 ? 'es' : ''} ({pesoTotal} kg) - ${item.subtotal.toFixed(2)}
              </span>
            </li>
          );
        })}
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
