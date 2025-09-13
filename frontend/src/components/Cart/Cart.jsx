import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/style";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiMinus, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { backend_url } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Cart = ({ setOpenCard }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

const totalPrice = cart.reduce(
  (acc, item) => acc + item.discountPrice * item.qty,
  0 // 👈 initial value
);

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  //const cartData = [
  //   {
  //     name: "Iphone 15 pro max 2546 gb ssd and 8 gb ram silver ",
  //     description: "test",
  //     price: 1200,
  //   },
  //   {
  //     name: "Iphone 14 pro max 2546 gb ssd and 100 gb ram silver ",
  //     description: "test",
  //     price: 1300,
  //   },
  //   {
  //     name: "Iphone 13 pro max 2356 gb ssd and 54 gb ram silver ",
  //     description: "test",
  //     price: 1300,
  //   },
  // ];

  return (
    <div className="fixed top-0 left-0 w-full text-black bg-[#0000002c] h-screen z-10 ">
      <div className="fixed top-0 right-0  bg-white w-[80%] 800px:w-[25%]   flex flex-col  shadow-sm">
       {
        cart && cart.length === 0 ? (
            <div className="w-full h-screen flex items-center justify-center">
              <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
                 <RxCross1
                 size={25}
                 className="cursor-pointer"
                 onClick={() => setOpenCard(false)}
                 />
              </div>
              <h5>Cart Item is empty</h5>
            </div>
        ) : (
          <>
             <div>
          <div className="flex w-full justify-end top-0 right-2 fixed mt-4 pr-5 text-black ">
            <RxCross1
              size={25}
              className="cursor-pointer "
              onClick={() => setOpenCard(false)}
            />
          </div>

          {/* ITEMS LENGTH */}

          <div className={`${styles.normalFlex} px-4 mt-12`}>
            <IoBagHandleOutline size={25} />
            <h5 className="pl-2 text-5 font-[500]">{cart && cart.length} Items</h5>
          </div>
          {/* CART ITEMS */}
          <br />
          <div className="w-full border-t">
            {cart &&
              cart.map((i, index) => (
                <CartSingle
                  key={index}
                  data={i}
                  quantityChangeHandler={quantityChangeHandler}
                  removeFromCartHandler={removeFromCartHandler}
                />
              ))}
          </div>
        </div>
        {/* CHECK OUT BUTTON */}
        <div className="px-5 mb-3">
          <Link to="/checkout">
            <div className="h-[45px] flex items-center mt-5 justify-center w-[100%] bg-red-500 rounded-[5px]">
              <h1 className="text-white text-[18px] font-[600]">
                CheckOut Now (USD$1080)
              </h1>
            </div>
          </Link>
        </div>
          </>
        )
}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const increment = (data) => {
    setValue(value + 1);
    if(data.stock < value){
            toast.error("Product stock limited!")
          } else{
    const updateCartData = { ...data, qty: value + 1 };
    quantityChangeHandler(updateCartData);
          }
  };

  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="border-b p-2">
      <div className="w-full flex items-center gap-4 ">
        {/* QUANTITY */}
        <div>
          <div
            className={`bg-[#e44343] border border-[#e4434373] rounded w-6 h-6 ${styles.normalFlex} justify-center cursor-pointer`}
            onClick={() => increment(data)}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="pl-2">{data.qty}</span>
          <div
            className="bg-[#a7abb14f] rounded w-6 h-6 flex  items-center justify-center cursor-pointer"
            onClick={() => decrement(data)}
          >
            <HiMinus size={18} />
          </div>
        </div>
        {/* iMAGE */}
        <img
          src={
            data?.images?.[0]
              ? `${backend_url}/${data.images[0].replace(/\\/g, "/")}`
              : "https://via.placeholder.com/150"
          }
          alt={data?.name}
          className="w-[80px] h-[80px] ml-2 mr-2 rounded-[5px] object-cover"
        />

        {/* DESCRIPYION */}
        <div className="pl-1">
          <h1 className="font-semibold">{data.name}</h1>
          <h4 className="font-[400] text-[15px] text-black ">
            ${data.discountPrice} * {value}
          </h4>
          <h4 className="font-[600] text-[16px] text-[#db2222] font-Roboto">
            US${totalPrice}
          </h4>
        </div>
        <RxCross1 className="cursor-pointer" onClick={() => removeFromCartHandler(data)}/>
      </div>
    </div>
  );
};

export default Cart;
