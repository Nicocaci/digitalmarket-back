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

    // Obtener token y extraer cartId al iniciar
    useEffect(() => {
        const token = Cookies.get('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Token decodificado:", decoded);
                setCartId(decoded.cart);
            } catch (err) {
                console.error("Error al decodificar el token:", err);
            }
        } else {
            console.warn("No se encontró el token en cookies.");
        }
    }, []);


    // Cargar carrito solo cuando cartId esté disponible
    useEffect(() => {
        if (!cartId) return;

        const fetchCart = async () => {
            try {
                const response = await axios.get(`${apiUrl}/carrito/${cartId}`, {
                    withCredentials: true,
                });
                console.log("Datos del carrito recibidos:", response.data);
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
                console.log("Token decodificado (refresh):", decoded);
                setCartId(decoded.cart); // Esto dispara el useEffect que carga el carrito
            } catch (err) {
                console.error("Error al decodificar el token:", err);
            }
        }
    };

    const addProductToCart = async (productId, quantity = 1) => {
        try {
            await axios.post(
                `${apiUrl}/carrito/${cartId}/productos/${productId}`,
                { quantity },
                { withCredentials: true }
            );
            // Luego hacer fetch del carrito actualizado
            const response = await axios.get(`${apiUrl}/carrito/${cartId}`, {
                withCredentials: true,
            });
            setCart(Array.isArray(response.data.products) ? response.data.products : []);
            toast.success("Producto agregado al carrito");
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            toast.error("Error al agregar producto");
        }
    };

const clearCart = async () => {
    try {
        await axios.delete(`${apiUrl}/api/carrito/${cartId}/productos`, {
            withCredentials: true,
        });
        setCart([]);
        toast.success("Carrito vaciado correctamente");
    } catch (error) {
        console.error("Error al vaciar carrito:", error);
        toast.error("Error al vaciar carrito");
    }
};



    const removeProductFromCart = async (productId, quantity = 1) => {
        try {
            await axios.delete(
                `${apiUrl}/api/carrito/${cartId}/productos/${productId}`,
                {
                    data: { quantity },
                    withCredentials: true,
                }
            );

            const response = await axios.get(`${apiUrl}/api/carrito/${cartId}`, {
                withCredentials: true,
            });
            setCart(response.data.products);
            toast.success("Producto eliminado correctamente");
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
            toast.error("Error al eliminar producto");
        }
    };
    const total = Array.isArray(cart)
        ? cart.reduce((acc, item) => {
            if (item.product && item.product.precio) {
                return acc + parseFloat(item.product.precio) * item.quantity;
            }
            return acc;
        }, 0)
        : 0;

    return (
        <CartContext.Provider value={{ cart, addProductToCart, removeProductFromCart, total, refreshCartContext, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
