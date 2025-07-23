import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
const apiUrl = import.meta.env.VITE_API_URL;


const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [cartId, setCartId] = useState(null);

    useEffect(() => {
        const token = Cookies.get('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCartId(decoded.cart);
            } catch (err) {
                console.error("Error al decodificar el token:", err);
            }
        }
    }, []);

    useEffect(() => {
        if (!cartId) return;

        const fetchCart = async () => {
            try {
                const response = await axios.get(`${apiUrl}/carrito/${cartId}`, {
                    withCredentials: true,
                });
                setCart(response.data.products);
            } catch (error) {
                console.error("Error al cargar carrito:", error);
            }
        };

        fetchCart();
    }, [cartId]);

    const refreshCartContext = () => {
        const token = Cookies.get('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCartId(decoded.cart);
            } catch (err) {
                console.error("Error al decodificar el token:", err);
            }
        }
    };

    const addProductToCart = async (productId, quantity = 1) => {
        try {
            await axios.post(`${apiUrl}/carrito/${cartId}/productos/${productId}`, { quantity }, { withCredentials: true });
            const response = await axios.get(`${apiUrl}/carrito/${cartId}`, { withCredentials: true });
            setCart(response.data.products);
            toast.success("Producto agregado al carrito");
        } catch (error) {
            console.error("Error al agregar producto:", error);
            toast.error("Error al agregar producto, debes iniciar sesión primero");
        }
    };

    const removeProductFromCart = async (productId, quantity = 1) => {
        try {
            await axios.delete(`${apiUrl}/carrito/${cartId}/productos/${productId}`, {
                data: { quantity },
                withCredentials: true,
            });
            const response = await axios.get(`${apiUrl}/carrito/${cartId}`, { withCredentials: true });
            setCart(response.data.products);
            toast.success("Producto eliminado correctamente");
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            toast.error("Error al eliminar producto");
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete(`${apiUrl}/carrito/${cartId}/productos`, {
                withCredentials: true,
            });
            setCart([]);
            toast.success("Carrito vaciado correctamente");
        } catch (error) {
            console.error("Error al vaciar carrito:", error);
            toast.error("Error al vaciar carrito");
        }
    };

    // 🟨 Nuevo: calcular total de kilos
    const getTotalKilos = () => {
        return Array.isArray(cart)
            ? cart.reduce((acc, item) => acc + item.quantity, 0)
            : 0;
    };

    // 🟨 Nuevo: detectar si aplica precio mayorista
    const isMayorista = getTotalKilos() >= 10;

    // 🟨 Nuevo: total con lógica de precio mayorista
    const total = Array.isArray(cart)
        ? cart.reduce((acc, item) => {
            if (item.product) {
                const base = parseFloat(item.product.precio);
                const precioUnitario = isMayorista ? base * 1.205 : base * 1.305;
                return acc + precioUnitario * item.quantity;
            }
            return acc;
        }, 0)
        : 0;


    return (
        <CartContext.Provider
            value={{
                cart,
                addProductToCart,
                removeProductFromCart,
                clearCart,
                refreshCartContext,
                total,
                isMayorista // 🟩 exportar el flag
            }}
        >
            {children}
        </CartContext.Provider>
    );
};