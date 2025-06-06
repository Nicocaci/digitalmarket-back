import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import CrearProducto from './CrearProducto.jsx';
import HistorialCompras from './HistorialCompras.jsx';
import Stock from './Stock.jsx';
import Usuarios from './Usuarios.jsx'

const PerfilAdmin = () => {


  return (
    <div>
      PerfilAdmin
      <div className='seccion-admin'>
        <CrearProducto />
        <HistorialCompras />
      </div>
      <div className='seccion-admin'>
        <Stock />
        <Usuarios/>
      </div>
    </div>


  )
}

export default PerfilAdmin