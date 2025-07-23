import React, { useState } from "react";
const apiUrlUD = import.meta.env.VITE_API_URL_UPLOADS;

const CartItem = ({ item, isMayorista, removeProductFromCart }) => {
    const [qtyToRemove, setQtyToRemove] = useState(1);

    const handleRemove = () => {
        removeProductFromCart(item.product._id, qtyToRemove);
    };

    const precioBase = item.product?.precio;

    const precioFinal = isMayorista
        ? (precioBase * 1.205).toFixed(2)
        : (precioBase * 1.305).toFixed(2);


    return (
        <li key={item._id} className="cart-item">
            <img src={`${apiUrlUD}/uploads/${item.product?.imagen}`} alt={item.product?.nombre} />
            <div className="details">
                <h4>{item.product?.nombre}</h4>
                <p>Cantidad: {item.quantity}</p>
                <p>$ {precioFinal}</p>
                <select
                    value={qtyToRemove}
                    onChange={(e) => setQtyToRemove(Number(e.target.value))}
                >
                    {[...Array(item.quantity).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>

                <button className="remove-btn" onClick={handleRemove}>
                    Eliminar
                </button>
            </div>
        </li>
    );
};

export default CartItem;
