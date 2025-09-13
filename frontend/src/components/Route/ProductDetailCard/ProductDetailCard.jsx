import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/style";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  AiOutlineMessage,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url } from "../../../server";
import { addTocart } from "../../../redux/actions/cart";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/Wishlist";

const ProductDetailCard = ({ setOpen, data }) => {
  const {wishlist} = useSelector((state) => state.wishlist)
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  // image URL build
const imageUrl = data?.images?.[0]
  ? `${backend_url}/${data.images[0].replace(/\\/g, "/")}`
  : "https://via.placeholder.com/300";


  console.log(data.images); // sari images array
console.log(data.shop?.avatar); // shop avatar object

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const increment = () => {
    setCount(count + 1);
  };

  const handleMessageSubmit = () => {};

  const addToCartHandler = (id) => {

    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if(data.stock < count){
        toast.error("Product stock limited!")
      } else{
         const cartData = { ...data, qty: count };
      dispatch(addTocart(cartData));
      toast.success("Item added to a cart successfully!");
      }
    }
  };

    useEffect(() => {
      if(wishlist && wishlist.find((i) => i._id === data._id)){
         setClick(true);
      } else{
        setClick(false);
      }
    }, [wishlist])
  
    const removeFromWishlistHandler = (data) => {
      setClick(!click);
      dispatch(removeFromWishlist(data))
    }
  
    const addToWishlistHandler = (data) => {
          setClick(!click);
      dispatch(addToWishlist(data))
    }

  return (
    <div className="bg-white">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            {/* Close Button */}
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50 cursor-pointer"
              onClick={() => setOpen(false)}
            />

            <div className="block w-full 800px:flex">
              {/* Left Side */}
              <div className="w-full 800px:w-[50%]">
                {/* Product Image */}
                <img
                  src={imageUrl}
                  alt={data?.name || "Product"}
                  className="w-full h-auto object-cover rounded-md"
                />

                {/* Shop Info */}
                <div className="flex mt-4 items-center">
                  <img
                    src={
                      data?.shop?.avatar?.url
                        ? `${backend_url}/${data.shop.avatar.url.replace(
                            /\\/g,
                            "/"
                          )}` // windows path fix
                        : "https://via.placeholder.com/50"
                    }
                    alt={data?.shop?.name || "Shop"}
                    className="w-[50px] h-[50px] rounded-full mr-2 object-cover"
                  />
                  <div>
                    <h3 className={`${styles.shop_name}`}>
                      {data?.shop?.name || "Unknown Shop"}
                    </h3>
                    <h5 className="pb-3 text-[15px]">
                      ({data?.shop?.ratings || 0}) Ratings
                    </h5>
                  </div>
                </div>

                {/* Message Button */}
                <div
                  className={`${styles.button} bg-black mt-4 rounded-[4px] h-11`}
                  onClick={handleMessageSubmit}
                >
                  <span className="text-white flex items-center">
                    Send Message <AiOutlineMessage className="ml-1" />
                  </span>
                </div>

                {/* Sold Out Info */}
                <h5 className="text-[16px] text-[red] mt-5">
                  ({data?.total_sell || 0}) Sold Out
                </h5>
              </div>

              {/* Right Side */}
              <div className="w-full 800px:w-[50%] pt-5 px-2">
                <h1 className={`${styles.productTitle} text-[20px]`}>
                  {data?.name}
                </h1>
                <p>{data?.description}</p>

                {/* Price */}
                <div className="flex pt-3 items-center">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data?.discount_price ? `$${data.discount_price}` : ""}
                  </h4>
                  <h3 className={`${styles.price} ml-2`}>
                    {data?.price ? `$${data.price}` : null}
                  </h3>
                </div>

                {/* Quantity + Wishlist */}
                <div className="flex items-center mt-12 justify-between pr-3">
                  {/* Quantity Buttons */}
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrement}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-r px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={increment}
                    >
                      +
                    </button>
                  </div>

                  {/* Wishlist */}
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
              onClick={() => removeFromWishlistHandler(data)}
                        color="red"
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
              onClick={() => addToWishlistHandler(data)}
                        color="#333"
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>

                {/* Add to Cart */}
                <div
                  className={`${styles.button} mt-6 h-11 flex items-center`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-white flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1 mt-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailCard;
