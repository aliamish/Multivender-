import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/style";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiMinus, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Cart = ({ setOpenCard }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (data) => {
    dispatch(addToCart(data));
  };

  return (
    <div className="fixed top-0 left-0 w-full text-black bg-[#0000004d] h-screen z-50">
      <div className="fixed top-0 right-0 min-h-full bg-white w-[80%] 800px:w-[26%] flex flex-col shadow-lg">
        {/* Empty Cart */}
        {cart && cart.length === 0 ? (
          <div className="w-full h-screen flex flex-col items-center justify-center">
            <RxCross1
              size={25}
              className="cursor-pointer absolute top-5 right-5"
              onClick={() => setOpenCard(false)}
            />
            <h5 className="text-lg font-medium">Your Cart is Empty!</h5>
          </div>
        ) : (
          <>
            {/* Close button */}
            <div className="flex w-full justify-end fixed top-5 right-5">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCard(false)}
              />
            </div>

            {/* Cart Header */}
            <div className={`${styles.normalFlex} px-5 mt-16 mb-3`}>
              <IoBagHandleOutline size={25} />
              <h5 className="pl-2 text-[16px] font-[600]">
                {cart && cart.length} Item(s)
              </h5>
            </div>

            {/* Cart Items */}
            <div className="w-full border-t overflow-y-auto max-h-[65vh] px-2">
              {cart &&
                cart.map((item, index) => (
                  <CartSingle
                    key={index}
                    data={item}
                    quantityChangeHandler={quantityChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
            </div>

            {/* Checkout */}
            <div className="px-5 mt-5 mb-3">
              <Link to="/checkout">
                <div className="h-[45px] flex items-center justify-center w-full bg-red-500 hover:bg-red-600 transition rounded-md">
                  <h1 className="text-white text-[18px] font-[600]">
                    Checkout Now (USD ${totalPrice.toFixed(2)})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const increment = () => {
    if (value < data.stock) {
      const newQty = value + 1;
      setValue(newQty);
      quantityChangeHandler({ ...data, qty: newQty });
    } else {
      toast.error("Product stock is limited!");
    }
  };

  const decrement = () => {
    if (value > 1) {
      const newQty = value - 1;
      setValue(newQty);
      quantityChangeHandler({ ...data, qty: newQty });
    }
  };

  return (
    <div className="border-b py-3 flex items-center gap-3">
      {/* Quantity Control */}
      <div className="flex flex-col items-center">
        <button
          className="bg-[#e44343] hover:bg-[#c73535] transition rounded w-6 h-6 flex items-center justify-center"
          onClick={increment}
        >
          <HiPlus size={16} color="#fff" />
        </button>
        <span className="py-1 font-medium">{value}</span>
        <button
          className="bg-[#a7abb14f] hover:bg-[#8c8f97] transition rounded w-6 h-6 flex items-center justify-center"
          onClick={decrement}
        >
          <HiMinus size={16} />
        </button>
      </div>

      {/* Product Image */}
      <img
        src={data?.images?.[0] || "/default.png"}
        alt={data?.name || "Product"}
        className="w-[80px] h-[80px] object-cover rounded-md"
      />

      {/* Product Info */}
      <div className="flex-1">
        <h1 className="font-semibold text-[15px]">{data.name}</h1>
        <h4 className="text-sm text-gray-600">
          ${data.discountPrice} × {value}
        </h4>
        <h4 className="text-[15px] font-bold text-[#db2222]">
          USD ${totalPrice.toFixed(2)}
        </h4>
      </div>

      {/* Remove Item */}
      <RxCross1
        className="cursor-pointer text-gray-600 hover:text-red-600"
        onClick={() => removeFromCartHandler(data)}
      />
    </div>
  );
};

export default Cart;