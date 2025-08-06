import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Inicio.css';
import BannerSlider from '../utils/BannerSlider.jsx';
import ProductoDestacado from '../components/ProductoDestacado.jsx';
import { Link } from 'react-router-dom';



const Inicio = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.2, // se activa cuando el 20% del elemento es visible
            }
        );

        const elements = document.querySelectorAll('.data-info');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, []);



    return (
        <section className='inicio'>
            <div className='seccion-inicio'>
                <video
                    src="/videoHome.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    disablePictureInPicture
                    controls={false}
                    className="mi-video"
                />
                <div className="contenido-inicio">
                    <h1>DIGITALSHOP</h1>
                    <p>Tu tienda de confianza online</p>

                    <Link to={"/productos"}><button className="btn-inicio">Ver Productos</button></Link>
                </div>
            </div>
            <div className='data-container'>
                <div className='data-info'>
                    <div className='data-logo center'>
                        <img src="/envioslogo.png" alt="envios" />
                    </div>
                    <div>
                        <p>
                            Envíos Express y SÍN CARGO!
                        </p>
                    </div>
                </div>
                <div className='data-info'>
                    <div>
                        <img src="/logopeso.png" alt="precios mayorista y minorista" />
                    </div>
                    <div>
                        <p>
                            Precios Mayorista y Minorista
                        </p>
                    </div>
                </div>
                <div className='data-info'>
                    <div>
                        <img src="/calidadlogo.png" alt="productos directo del frigorifico" />
                    </div>
                    <div>
                        <p>
                            Productos directo del frigorífico
                        </p>
                    </div>
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
