import React, { useState } from "react";

const CartItem = ({ item, removeProductFromCart }) => {
    
    const [qtyToRemove, setQtyToRemove] = useState(1);

    const handleRemove = () => {
        removeProductFromCart(item.product._id, qtyToRemove);
    };
    return (
        <li key={item._id} className="cart-item">
            <img src={`http://localhost:3000/uploads/${item.product.imagen}`} alt={item.product?.nombre} />
            <div className="details">
                <h4>{item.product?.nombre}</h4>
                <p>Cantidad: {item.quantity}</p>
                <p>$ {item.product?.precio}</p>

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
