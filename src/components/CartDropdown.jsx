import React, { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext.jsx';
import '../css/CartDropdown.css';
import CartItem from './CartItem';
import { Link } from 'react-router-dom';

const CartDropdown = ({ visible, onClose }) => {
    const { cart, total, isMayorista, removeProductFromCart } = useCart();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose(); // Cierra si se hace clic fuera del dropdown
            }
        };

        if (visible) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [visible, onClose]);

    return (
        <div ref={dropdownRef} className={`cart-dropdown ${visible ? "visible" : ""}`}>
            <div className="cart-header">
                <h3>Tu Carrito</h3>
                <button className="close-btn" onClick={onClose}>
                    ×
                </button>
            </div>

            {isMayorista && (
                <div className="mayorista-alert">
                    🎉 ¡Se aplicó el precio mayorista por superar los 10kg!
                </div>
            )}
            {!cart || cart.length === 0 ? (
                <p className="empty">El carrito está vacío</p>
            ) : (
                <>
                    <ul className="cart-items">
                        {cart.map((item) => (
                            <CartItem
                                key={item._id}
                                item={item}
                                isMayorista={isMayorista}
                                removeProductFromCart={removeProductFromCart}
                            />
                        ))}
                    </ul>
                    <div className="cart-total">
                        <h4>Total: $ {(total).toFixed(2)}</h4>
                    </div>
                    <div className="checkout-btn-container">
                        <Link to="/checkOut">
                            <button className="checkout-btn" onClick={onClose}>Finalizar Compra</button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartDropdown;
