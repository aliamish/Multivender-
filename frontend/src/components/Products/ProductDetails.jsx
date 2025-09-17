import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/style";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url, server } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { useEffect } from "react";
import {
  addToWishlist,
  removeFromWishlist,
} from "../redux/actions/Wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import axios from "axios";
import Ratings from '../../components/Products/Ratings'
const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const { products } = useSelector((state) => state.products);

  const [count, setCount] = useState(1);

  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProductsShop(data?._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist]);

  function increment() {
    setCount(count + 1);
  }
  function decrement() {
    if (count > 1) {
      setCount(count - 1);
    }
  }

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to a cart successfully!");
      }
    }
  };

  const totalReviewslength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const averageRating = totalRatings / totalReviewslength || 0;

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(
          `${server}/conversation/create-new-conversation`,
          {
            groupTitle,
            userId,
            sellerId,
          },
          { withCredentials: true }
        )
        .then((res) => {
          navigate(`/conversation/${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to countinue");
    }
  };
  return (
    <div className="bg-white">
      {data ? (
        <div className={`unset ${styles.section} w-[90%] 800px:w-[80%] h-full`}>
          {/* TOP COMPONENT */}
          <div className="w-full py-5 ">
            <div className=" w-full 800px:flex">
              {/* LEFT SIDE CONTENT */}
              <div className="w-full 800px:[50%]">
                <img
                  src={`${data && data.images[select]}`}
                  alt=""
                  className="w-[80%]"
                />
                <div className="w-full flex">
                  {data &&
                    data.images.map((i) => {
                      <div
                        className={`${
                          select === 0 ? "border" : "null"
                        } cursor-pointer`}
                      >
                        <img
                          src={`${i}`}
                          alt=""
                          className="h-[200px] overflow-hidden mr-3 mt-3 "
                          onClick={() => setSelect(i)}
                        />
                      </div>
                    })}
                  <div
                    className={`${
                      select === 1 ? "border" : "null"
                    } cursor-pointer`}
                  ></div>
                </div>
              </div>
              {/* RIGHT SIDE CONTENT */}
              <div className="w-full 80px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p>{data.description}</p>
                {/* PRICE */}
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discountPrice}$
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? data.originalPrice + "$" : null}
                  </h3>
                </div>
                {/* BUTTONS */}
                <div
                  className={`${styles.normalFlex} mt-12 justify-between pr-3`}
                >
                  <div className="flex w-full items-center mt-12 justify-between pr-3">
                    {/* BUTTON */}
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
                    {/* FAVOURITE */}
                    <div>
                      {click ? (
                        <AiFillHeart
                          size={30}
                          className="cursor-pointer "
                          onClick={() => removeFromWishlistHandler(data)}
                          color={click ? "red" : "#333"}
                          title="Remove from wishlist"
                        />
                      ) : (
                        <AiOutlineHeart
                          size={30}
                          className="cursor-pointer "
                          onClick={() => addToWishlistHandler(data)}
                          color={click ? "red" : "#333"}
                          title="Add to wishlist"
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/* BUTTONS */}
                <div
                  className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-white flex items-center">
                    Add to cart <AiOutlineShoppingCart />{" "}
                  </span>
                </div>

                {/* SEND MESSAGE */}
                <div className="flex items-center pt-8 ">
                  <Link to={`/shop/preview/${data?.shop._id}`}>
                    <img
                      src={`${data?.shop?.avatar}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                  </Link>
                  <div className="pr-8">
                    <Link to={`/shop/preview/${data?.shop._id}`}>
                      <h3 className={`${styles.shop_name} pt-1`}>
                        {data.shop.name}
                      </h3>
                    </Link>
                    <h5 className="pb-3 text-[15px]">
                      ({averageRating}/5)Ratings
                    </h5>
                  </div>
                  <div
                    className={`${styles.button} bg-[#6443d1] !rounded !h-11`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center">
                      Send Message <AiOutlineMessage className="ml-1 mt-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* BOTTOM COMPONENT && MORE  INFORMATION ABOUT PRODUCT */}
          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewslength={totalReviewslength}
            averageRating={averageRating}
          />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewslength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded h-full">
      {/* HEADINGS */}
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className=" text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-xl]"
            onClick={() => setActive(1)}
          >
            Product Detail
          </h5>

          {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className=" text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-xl]"
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>

          {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className=" text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-xl]"
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>

          {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>
      {/* HEADINGS DETAILS */}
      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      ) : null}
      {active === 2 ? (
        <p className="text-center my-14">
          {data &&
            data.reviews.map((item, index) => {
              <div className="w-full flex my-2">
                {item?.user?.avatar && (
                  <img
                    src={
                      item.user.avatar.startsWith("http")
                        ? item.user.avatar
                        : `${item.user.avatar}`
                    }
                    alt="profile"
                    className="w-[60px] h-[60px] rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="w-full flex">
                    <h1 className="pl-2 font-[500]">{item.user.name}</h1>
                    <Ratings rating={data?.rating} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>;
            })}
          <div className="w-full flex justify-center">
            {data && data.reviews.length === 0 && (
              <h5>No Reviews have for this product!</h5>
            )}
          </div>
        </p>
      ) : null}
      {active === 3 && (
        <div className="w-full sm:flex justify-between 800px:flex p-5">
          <div className="w-full block 800px:w-[50%]">
            <Link to={`/shop/preview/${data.shop._id}`}>
              <div className="flex items-center">
                <img
                  src={`${data?.shop?.avatar}`}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-3">
                  <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                  <h4 className="pb-3 text-[15px]">
                    (averageRating) /5 Ratings
                  </h4>
                </div>
              </div>
            </Link>
            <p className="pt-3 ">{data.shop.description}</p>
          </div>
          <div className=" 800px:w-[50p%] mt-5 800px:mt-0 800px:flex flex-col items-center">
            <div className="text-left">
              <h5 className="font-[700]">
                {" "}
                Joined on:{" "}
                <span className="font-[500]">
                  {data.shop?.createAt?.slice(0, 10)}
                </span>
              </h5>
              <h5 className="font-[700] pt-3">
                {" "}
                Total Products:{" "}
                <span className="font-[500]">
                  {products && products.length}
                </span>
              </h5>
              <h5 className="font-[700] pt-3">
                {" "}
                Total Reviews:{" "}
                <span className="font-[500]">{totalReviewslength}</span>
              </h5>
              <Link to="/">
                <div className={`${styles.button} rounded !h-[40px] mt-3`}>
                  <h4 className="text-white font-semibold text-[18px]">
                    Visit Shop
                  </h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
