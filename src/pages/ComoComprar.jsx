import React from 'react';
import '../css/ComoComprar.css'

const ComoComprar = () => {
  return (
    <div>
      <div className='center tituloComprar'>
      <h1>Como Comprar?...</h1>
      </div>
      <section className='section'>
      <div className='ComoComprar'>
        <div className='ComoComprarCards'>
          <h2 className='tituloComprar1'>Create un usuario e Inicia sesion</h2>
          <li className='textoComprar'>Create una cuenta y luego Inicia sesión para poder empezar a comprar.</li>
          <li className='textoComprar'>Al crear una cuenta, se crea tu propoio carrito para poder llevar el control de tus compras.</li>
        </div>
        <div className='ComoComprarCards'>
          <h2 className='tituloComprar2'>Llená tu carrito!</h2>
          <li className='textoComprar'>Elegí el producto que quieras y presiona el botón "Agregar al carrito".</li>
          <li className='textoComprar'>Una vez que ya agregaste todos los productos deseados, presiona "Iniciar Compra</li>
        </div>
        <div className='ComoComprarCards'>
          <h2 className='tituloComprar3'>¿Como lo recibís?</h2>
          <li className='textoComprar'>Una vez que inicias la compra, ingregsá tu código postal para calcular el precio del envío.</li>
          <li className='textoComprar'>Completá con tus datos personales para que podamos enviarte el pedido.</li>
          <li className='textoComprar'>Selecciona el metodo de envío mas conveniente</li>
        </div>
        <div className='ComoComprarCards'>
          <h2 className='tituloComprar4'>Pagá tu orden!</h2>
          <li className='textoComprar'>Elegí el medio de pagó mas conveniente para abonar tu pedido</li>
          <li className='textoComprar'>Finalmente en la página de confirmación revisa toda tu información de compra y si está todo bien, ya podes hacer click en "Continuar"</li>
          <li className='textoComprar'>Completá los datos de la forma de pago elegida y recibirás un correo.</li>
          <li className='textoComprar'>Una vez acreditado el pago, hacemos el envío!</li>
        </div>

      </div>
      </section>
    </div>
  )
}

export default ComoComprar