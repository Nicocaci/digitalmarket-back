import React, { useState } from "react";
const apiUrlUD = import.meta.env.VITE_API_URL_UPLOADS;

const CartItem = ({ item, isMayorista, removeProductFromCart }) => {
    const producto = item.product;
    const pesoUnitario = producto.peso;
    const cantidadEnCarrito = Math.round(item.quantity / pesoUnitario); // 👈 cantidad real

    const [qtyToRemove, setQtyToRemove] = useState(1);

    const handleRemove = () => {
        const pesoARemover = qtyToRemove * pesoUnitario;
        removeProductFromCart(producto._id, pesoARemover); // eliminás por peso
    };

    const precioBase = producto?.precio;
    const precioFinal = isMayorista
        ? (precioBase * 1.205).toFixed(2)
        : (precioBase * 1.305).toFixed(2);

    return (
        <li key={item._id} className="cart-item">
            <img
                src={`${apiUrlUD}/uploads/${producto?.imagen}`}
                alt={producto?.nombre}
            />
            <div className="details">
                <h4>{producto?.nombre}</h4>
                <p><strong>Kilos en carrito:</strong> {item.quantity.toFixed(2)} kg</p>
                <p><strong>Unidades en carrito:</strong> {cantidadEnCarrito}</p>
                <p><strong>Precio por KG:</strong> $ {precioFinal}</p>

                <label>Eliminar cantidad:</label>
                <select
                    value={qtyToRemove}
                    onChange={(e) => setQtyToRemove(Number(e.target.value))}
                >
                    {[...Array(cantidadEnCarrito).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1} unidad(es)
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
