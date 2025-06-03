import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import CrearProducto from './CrearProducto.jsx';
import HistorialCompras from './HistorialCompras.jsx';

const PerfilAdmin = () => {
  
  
    return (
    <div>
        PerfilAdmin
        <div className='seccion-admin'>
        <CrearProducto/>
        <HistorialCompras/>
        </div>
    </div>


  )
}

export default PerfilAdmin