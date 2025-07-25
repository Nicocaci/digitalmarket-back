import axios from 'axios';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

const apiUrl = import.meta.env.VITE_API_URL;

const Paso4Finalizar = ({ formData, total: totalProp, prevStep }) => {
  const { clearCart, cart } = useCart();
  const navigate = useNavigate();

  const totalKilos = cart.reduce((acc, item) => acc + item.quantity, 0);
  const esMayorista = totalKilos >= 10;

  const productosFormateados = cart.map(item => {
    const prod = item.product || item.producto || item;
    const cantidad = item.quantity || item.cantidad || 0;
    const precioBase = prod.precio || 0;
    const peso = prod.peso || 1;
    const precioFinal = precioBase;

    return {
      productId: prod._id || item._id || null,
      nombre: prod.nombre || 'Sin nombre',
      precio: precioFinal,
      peso,
      quantity: cantidad
    };
  });

  const totalCalculado = productosFormateados.reduce((acc, item) => {
    const precioAjustado = esMayorista
      ? item.precio * 1.205
      : item.precio * 1.305;
    return acc + precioAjustado * item.quantity;
  }, 0);

  const handleSubmit = async () => {
    try {
      const ordenData = {
        ...formData,
        productos: productosFormateados,
        total: totalCalculado,
        metodoPago: 'efectivo',
        estado: 'pendiente',
        fecha: new Date(),
      };

      const res = await axios.post(`${apiUrl}/orders/crear-orden`, ordenData, {
        withCredentials: true,
      });

      const nuevaOrden = res.data.orden;

      const productosTexto = productosFormateados
        .map(item => {
          const unidades = Math.round(item.quantity / item.peso);
          const precioAjustado = esMayorista
            ? item.precio * 1.205
            : item.precio * 1.305;
          const subtotal = precioAjustado * item.quantity;
          return `${item.nombre} x${unidades} unidad${unidades !== 1 ? 'es' : ''} (${item.quantity.toFixed(2)} kg) - $${subtotal.toFixed(2)}`;
        })
        .join('\n');

      const emailParams = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        metodoPago: 'Efectivo',
        productos: productosTexto,
        total: totalCalculado.toFixed(2),
      };

      // 📩 Enviar al cliente
      await emailjs.send(
        'service_owbp44t',
        'template_2rj0flv',
        emailParams,
        'BOrfBHSq-UsH597J3'
      );

  // 📩 Enviar al admin (vos)
  await emailjs.send(
    'service_owbp44t',
    'template_2rj0flv',
    {
      ...emailParams,
      email: 'digitalmarketfn@gmail.com',
      nombre: `🛎 Nuevo pedido de ${formData.nombre}`
    },
    'BOrfBHSq-UsH597J3'
  );

      clearCart();
      navigate('/gracias', { state: { orden: nuevaOrden } });

    } catch (error) {
      console.error('❌ Error al finalizar compra:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un problema al finalizar la compra. Intentá de nuevo.'
      });
    }
  };

  return (
    <div className="paso paso4">
      <h2>Revisá tu pedido</h2>

      <div className="detalle-comprador">
        <h3>Datos del comprador</h3>
        <p><strong>Nombre:</strong> {formData.nombre}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Teléfono:</strong> {formData.telefono}</p>
        <p><strong>Dirección:</strong> {formData.direccion}</p>
        <p><strong>Localidad:</strong> {formData.localidad}, {formData.provincia}</p>
        <p><strong>Código Postal:</strong> {formData.cp}</p>
        <p><strong>Método de pago:</strong> Efectivo</p>
      </div>

      <div className="detalle-pedido">
        <h3>Productos</h3>
        <ul className="lista-productos">
          {productosFormateados.map((item, i) => {
            const unidades = Math.round(item.quantity / item.peso);
            const precioAjustado = esMayorista
              ? item.precio * 1.205
              : item.precio * 1.305;
            const subtotal = precioAjustado * item.quantity;

            return (
              <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <p style={{ margin: 0 }}>
                    {item.nombre} x{unidades} unidad{unidades !== 1 ? 'es' : ''} ({item.quantity.toFixed(2)} kg)
                  </p>
                  <small>
                    Precio por kg: ${precioAjustado.toFixed(2)} – Subtotal: <strong>${subtotal.toFixed(2)}</strong>
                  </small>
                </div>
              </li>
            );
          })}
        </ul>

        <h4>Total: ${totalCalculado.toFixed(2)}</h4>
      </div>

      <div className="botones-finalizar">
        <button onClick={prevStep}>Volver</button>
        <button onClick={handleSubmit}>Confirmar Compra</button>
      </div>
    </div>
  );
};

export default Paso4Finalizar;
