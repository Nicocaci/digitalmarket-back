import Inicio from "./pages/Inicio.jsx";
import NavBar from "./components/NavBar.jsx";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Faq from "./pages/Faq.jsx";
import Perfil from "./pages/Perfil/Perfil.jsx";
import Contacto from "./pages/Contacto.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckOut from "./components/CheckOut.jsx";
import Gracias from "./components/Gracias.jsx";
import Productos from "./pages/Productos.jsx";
import Pedidos from "./pages/Perfil/PerfilUser/Pedidos.jsx";
import ItemDetail from "./components/ItemDetail.jsx";




function App() {

  return (
    <>
      <CartProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route exact path="/" element={<Inicio />} />
            <Route exact path="/contacto" element={<Contacto />} />
            <Route exact path="/perfil" element={<Perfil />} />
            <Route exact path="/faq" element={<Faq />} />
            <Route exact path="/checkOut" element={<CheckOut />} />
            <Route exact path="/productos" element={<Productos />} />
            <Route exact path="/pedidos" element={<Pedidos />} />
            <Route path="/gracias" element={<Gracias />} />
            <Route path="/productos/:id" element={<ItemDetail/>} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </CartProvider>
    </>
  )
}

export default App;
