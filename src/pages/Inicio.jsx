import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Inicio.css';
import BannerSlider from '../utils/BannerSlider.jsx';
import ProductoDestacado from '../components/ProductoDestacado.jsx';
import { Link } from 'react-router-dom';



const Inicio = () => {



    return (
        <section className='inicio'>
            <div className='seccion-inicio'>
                <video src="/videoHome.mp4" autoPlay muted loop className="mi-video" />
                <div className="contenido-inicio">
                    <h1>DIGITALSHOP</h1>
                    <p>Tu tienda de confianza online</p>
                    
                    <Link to={"/productos"}><button className="btn-inicio">Ver Productos</button></Link>
                </div>
            </div>


            {/* <div className="hero-banner">
                <BannerSlider />
                <div className="hero-text">Excelencia Miguez</div>
            </div> */}
            <h1 className="title blur-in">Productos Destacados</h1>
            <ProductoDestacado />
        </section>
    )
}

export default Inicio;
