import Inicio from "./pages/Inicio.jsx";
import NavBar from "./components/NavBar.jsx";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ComoComprar from "./pages/ComoComprar.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Perfil from "./pages/Perfil/Perfil.jsx";
import Contacto from "./pages/Contacto.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckOut from "./components/CheckOut.jsx";
import Gracias from "./components/Gracias.jsx";




function App() {

  return (
    <>
      <CartProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route exact path="/" element={<Inicio />} />
            <Route exact path="/contacto" element={<Contacto />} />
            <Route exact path="/comocomprar" element={<ComoComprar />} />
            <Route exact path="/perfil" element={<Perfil />} />
            <Route exact path="/nosotros" element={<Nosotros />} />
            <Route exact path="/checkOut" element={<CheckOut />} />
            <Route path="/gracias" element={<Gracias />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </CartProvider>
    </>
  )
}

export default App;
