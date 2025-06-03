import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import CrearProducto from './CrearProducto.jsx';

const PerfilAdmin = () => {
  
  
    return (
    <div>
        PerfilAdmin
        <CrearProducto/>
    </div>


  )
}

export default PerfilAdmin