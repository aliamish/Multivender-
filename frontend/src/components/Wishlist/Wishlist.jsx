import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/style";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/Wishlist";
import { addTocart } from "../../redux/actions/cart";

const Wish = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addTocart(newData));
    setOpenWishlist(false);
  };
  console.log(setOpenWishlist);

  return (
    <div className="fixed top-0 left-0 w-full text-black bg-[#0000002c] h-screen z-10 ">
      <div className="fixed top-0 right-0 h-full bg-white w-[80%] 800px:w-[26%]  overflow-y-scroll  flex flex-col  shadow-sm">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer "
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <h5>whishlist Item is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end top-0 right-2 fixed mt-4 pr-5 text-black ">
                <RxCross1
                  size={25}
                  className="cursor-pointer "
                  onClick={() => setOpenWishlist(false)}
                />
              </div>

              {/* ITEMS LENGTH */}

              <div className={`${styles.normalFlex} px-4 mt-12`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-5 font-[500]">
                  {wishlist && wishlist.length}
                </h5>
              </div>
              {/* CART ITEMS */}
              <br />
              <div className="w-full border-t">
                {wishlist &&
                  wishlist.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      removeFromWishlistHandler={removeFromWishlistHandler}
                      addToCartHandler={addToCartHandler}
                    />
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
        <RxCross1
          className=" cursor-pointer mb-2 ml-2 800px:mb-['unset'] 800px:ml-['unset']"
          size={30}
          onClick={() => removeFromWishlistHandler(data)}
        />
        {/* iMAGE */}
        <img
          src={`${data?.images[0]}`}
          alt=""
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px] "
        />

        {/* DESCRIPYION */}
        <div className="pl-[5px]">
          <h1 className="font-semibold">{data.name}</h1>
          <h4 className="font-[600] 800px:pt-[3px] pt-3 text-[16px] text-[#db2222] font-Roboto">
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

export default Wish;
