import React from 'react';
import '../css/ComoComprar.css'

const Nosotros = () => {
  return (
    <div className='seccion-faq'>
        <h1 className='titulo-faq'>Preguntas Frecuentes</h1>
      <div className='seccion-como-comprar'>
        <div className=' center'>
          <h2 className='tituloComprar'>¿Como Comprar?</h2>
        </div>
        <div className='ComoComprar'>
          <div className='ComoComprarCards'>
            <h2 className='tituloComprar1'>Registrate e Inicia sesion</h2>
            <li className='textofaq'>Create una cuenta y luego Inicia sesión para poder empezar a comprar.</li>
            <li className='textofaq'>Al crear una cuenta, se crea tu propoio carrito para poder llevar el control de tus compras.</li>
          </div>
          <div className='ComoComprarCards'>
            <h2 className='tituloComprar2'>Llená tu carrito!</h2>
            <li className='textofaq'>Elegí el producto que quieras y presiona el botón "Agregar al carrito".</li>
            <li className='textofaq'>Una vez que ya agregaste todos los productos deseados, presiona "Iniciar Compra</li>
          </div>
          <div className='ComoComprarCards'>
            <h2 className='tituloComprar3'>¿Como lo recibís?</h2>
            <li className='textofaq'>Una vez que inicias la compra, ingregsá tu código postal para calcular el precio del envío.</li>
            <li className='textofaq'>Completá con tus datos personales para que podamos enviarte el pedido.</li>
            <li className='textofaq'>Selecciona el metodo de envío mas conveniente</li>
          </div>
          <div className='ComoComprarCards'>
            <h2 className='tituloComprar4'>Pagá tu orden!</h2>
            <li className='textofaq'>Elegí el medio de pagó mas conveniente para abonar tu pedido</li>
            <li className='textofaq'>Finalmente en la página de confirmación revisa toda tu información de compra y si está todo bien, ya podes hacer click en "Continuar"</li>
            <li className='textofaq'>Completá los datos de la forma de pago elegida y recibirás un correo.</li>
            <li className='textofaq'>Una vez acreditado el pago, hacemos el envío!</li>
          </div>
        </div>
      </div>
      <div className='seccion-envio'>
        <div className=' center'>
          <h2 className='tituloComprar'>¿Cuales son las formas de envio?</h2>
        </div>
        <div className='seccion-envio2'>
          <p className='textofaq'>Al finalizar tu compra podés elegir recibir el pedido en tu domicilio o retirarlo en nuestro local.
            Si elegís la opción de envío a domicilio, recibirás tu pedido al día siguiente de haberlo realizado. ¿Querés recibirlo en una franja horaria específica? ¡No hay problema! Contactanos vía Whatsapp apenas realizás tu pedido de modo de poder coordinarlo.
            Si elegís retirarlo en nuestro local te enviaremos un mensaje cuando tu pedido esté listo para retirar.</p>
        </div>
      </div>
      <div className='seccion-envio'>
        <div className='center'>
          <h2 className='tituloComprar'>¿Cuanto cuesta un envío?</h2>
        </div>
        <div className='seccion-envio2'>
          <p className='textofaq'>¡El costo de envío es GRATIS! Sí, por tiempo limitado estamos bonificando nuestro costo de envío para que pruebes nuestro servicio. Sólo recordá que el monto mínimo de compra es de $2000.!</p>
        </div>
      </div>
      <div className='seccion-envio'>
        <div className=' center'>
          <h2 className='tituloComprar'>¿Cuales son las formas de pago?</h2>
        </div>
        <div  className='seccion-envio2'>
          <p className='textofaq'>Podés abonar al momento de recibir tu compra en efectivo, tarjeta de crédito o débito. Recordá que para abonar con tarjetas en el domicilio el titular deberá estar presente para recibir la compra. También podés solicitar recibir un botón de pago electrónico una vez que facturemos tu pedido, con este podrás abonar en MercadoPago con cualquier tarjeta, sin necesidad de que el titular esté presente al momento de recibir la compra. Te recordamos que pueden existir pequeñas diferencias entre el valor indicado al finalizar la compra y el valor facturado, debido a variaciones de peso en los productos pesable o faltante de stock. Comprá online y recibí tu pedido a domicilio.</p>
        </div>
      </div>
    </div>
  )
}

export default Nosotros;