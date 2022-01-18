import React from "react";
import "./CartItem.css";

function CartItem({ item, index, buttonHandler, deleteItemHandler }) {
  if (!item.product) return null;
  return (
    <div className="item">
      <div className="image">
        <img src={item.product?.thumbnail.url} alt="Img" style={{ height: "100%" }} />
      </div>
      <div className="description">
        <span>{item.product?.name}</span>
        <span>Bello</span>
      </div>
      <div className="quantity">
        <button onClick={() => buttonHandler("plus", index)} className="plus-btn" type="button" name="button">
          +
        </button>
        <input type="text" readOnly name="name" value={item.quantity.raw} />
        <button onClick={() => buttonHandler("minus", index)} className="minus-btn" type="button" name="button">
          -
        </button>
      </div>
      <div className="total-price">₩{item.price.original.raw}</div>
      <div className="buttons">
        <span style={{ cursor: "pointer" }} onClick={() => deleteItemHandler(item._id, item.price.original.raw)} className="delete-btn">
          X
        </span>
      </div>
    </div>
  );
}

export default CartItem;
