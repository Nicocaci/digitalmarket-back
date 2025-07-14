import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import '../css/CartDropdown.css';
import { useEffect, useState } from 'react';
import CartItem from './CartItem';
import CheckOut from './CheckOut';
import { Link } from 'react-router-dom';


const CartDropdown = ({ visible, onClose }) => {
    const { cart, total, removeProductFromCart } = useCart();

    return (
        <div className={`cart-dropdown ${visible ? "visible" : ""}`}>
            <div className="cart-header">
                <h3>Tu Carrito</h3>
                <button className="close-btn" onClick={onClose}>
                    ×
                </button>
            </div>

            {!cart || cart.length === 0 ? (
                <p className="empty">El carrito está vacío</p>
            ) : (
                <>
                    <ul className="cart-items">
                        {cart.map((item) => (
                            <CartItem
                                key={item._id}
                                item={item}
                                removeProductFromCart={removeProductFromCart}
                            />
                        ))}
                    </ul>
                    <div className="cart-total">
                        <h4>Total: $ {total.toFixed(2)}</h4>
                    </div>
                    <div className="checkout-btn-container">
                        <Link to="/checkOut">
                            <button className="checkout-btn">Finalizar Compra</button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartDropdown;