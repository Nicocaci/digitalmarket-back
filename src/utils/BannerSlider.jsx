import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import '../css/BannerSlider.css'


const BannerSlider = () => {
    const images = [
        "/salamesPublicidad.jpg",
        "/salamesPublicidad2.jpg",
        "/salamesPublicidad3.jpg"
    ];

    const [current, setCurrent] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // Inicia desvanecimiento
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % images.length);
                setFade(true); // Vuelve a mostrar
            }, 500); // Duración del fade-out
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
<div className="hero-banner">
  <div className="banner-overlay">
    Bienvenidos a DIGITALMARKET
  </div>
  <img
    src={images[current]}
    alt="Banner"
    className={`banner-image ${fade ? 'fade-in' : 'fade-out'}`}
  />
</div>
    );
};

export default BannerSlider;
