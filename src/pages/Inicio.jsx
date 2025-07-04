import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Inicio.css';
import BannerSlider from '../utils/BannerSlider.jsx';
import ProductoDestacado from '../components/ProductoDestacado.jsx';



const Inicio = () => {



    return (
        <section className='inicio'>
            <div className="hero-banner">
                <BannerSlider />
                <div className="hero-text">Excelencia Miguez</div>
            </div>
            <h1 className="title blur-in">Productos Destacados</h1>
            <ProductoDestacado />
        </section>
    )
}

export default Inicio;
