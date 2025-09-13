import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/style";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist,  } from "../../redux/actions/Wishlist";
import { backend_url } from "../../server";
import { addTocart } from "../../redux/actions/cart";

const Wishlist = ({ setOpenWish }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
   


  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    const newData = {...data, qty:1}
    dispatch(addTocart(newData));
    setOpenWish(false);
  }

  // const cartData = [
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
      <div className="fixed top-0 right-0 h-full bg-white overflow-y-scroll w-[80%] 800px:w-[26%]   flex flex-col  shadow-sm">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenWish(false)}
              />
            </div>
            <h5>Wishlist Item is empty</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end top-0 right-2 fixed mt-4 pr-5 text-black ">
                <RxCross1
                  size={25}
                  className="cursor-pointer "
                  onClick={() => setOpenWish(false)}
                />
              </div>

              {/* ITEMS LENGTH */}

              <div className={`${styles.normalFlex} px-4 mt-12`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-5 font-[500]">
                  {wishlist && wishlist.length}item
                </h5>
              </div>
              {/* CART ITEMS */}
              <br />
              <div className="w-full border-t">
                {wishlist &&
                  wishlist.map((i, index) => (
                    <CartSingle key={index} data={i} removeFromWishlistHandler={removeFromWishlistHandler} addToCartHandler={addToCartHandler}/>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.discountPrice * value;
  return (
    <div className="border-b p-2">
      <div className="w-full 800px:flex items-center gap-4 ">
        <RxCross1 className=" cursor-pointer 800px:mb-['unset'] 800px:ml-['unset'] mb-2 ml-2" size={30} 
        onClick={() => removeFromWishlistHandler(data)}
        />
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
          <h4 className="font-[600] pt-3 800px:pt-[3px] text-[16px] text-[#db2222] font-Roboto">
            US${totalPrice}
          </h4>
        </div>
        <div>
          <BsCartPlus
            size={20}
            className="cursor-pointer"
            tittle="Add to cart"
            onClick={() => addToCartHandler(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
