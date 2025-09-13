import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../Route/productCard/productCard";
import { getAllProductsShop } from "../../redux/actions/product";
import { Link, useParams } from "react-router-dom";
import styles from "../../styles/style";
import { backend_url } from "../../server";
import Ratings from "../Products/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events} = useSelector((state) => state.events);
    const { seller } = useSelector((state) => state.seller);

  const { id } = useParams();
  const dispatch = useDispatch();
  
    
  


  useEffect(() => {
    if (id) {
      dispatch(getAllProductsShop(id));
            dispatch(getAllEventsShop(seller._id));

    }
  }, [dispatch, id]);

  const [active, setActive] = useState(1);

  // ✅ allReviews ko safe banaya
  const allReviews =
    products?.map((product) => product.reviews || []).flat() || [];

  return (
    <div className="w-full ">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex">
          <div className="flex items-center" onClick={() => setActive(1)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 1 ? "text-red-500" : "text-[#333]"
              } cursor-pointer px-5`}
            >
              Shop Products
            </h5>
          </div>
          <div className="flex items-center" onClick={() => setActive(2)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 2 ? "text-red-500" : "text-[#333]"
              }    cursor-pointer pr-5 `}
            >
              Running Events
            </h5>
          </div>
          <div className="flex items-center" onClick={() => setActive(3)}>
            <h5
              className={`font-[600] text-[20px]  ${
                active === 3 ? "text-red-500" : "text-[#333]"
              }  cursor-pointer pr-5 `}
            >
              Shops Reviews
            </h5>
          </div>
        </div>
        <div>
          {isOwner && (
            <div>
              <Link to="/dashboard">
                <div className={`${styles.button} !rounded-[4px]  h-[42px]  `}>
                  <span className="text-white">Go Dashboard</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <br />
      {active === 1 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4 xl:gap-5  mb-12 border-0">
          {products &&
            products.map((i, index) => {
              return <ProductCard data={i} key={index} isShop={true} />;
            })}
        </div>
      )}

      {
        active === 2 && (
          <div className="w-full">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4 xl:gap-5  mb-12 border-0">
          {events &&
            events.map((i, index) => {
              return <ProductCard data={i} key={index} isShop={true} isEvent={true} />;
            })}
        </div>
          </div>
        )
      }

      {active === 3 && (
        <div className="w-full">
          {allReviews.length > 0 ? (
            allReviews.map((item, index) => (
              <div className="w-full flex my-4" key={index}>
                <img
                  src={`${backend_url}/${
                    item?.user?.avatar?.url || item?.user?.avatar
                  }`}
                  alt={item?.user?.name}
                  className="w-[100px] h-[100px] rounded-full object-cover"
                />
                <div className="pl-2">
                  <div className="flex w-full items-center">
                    <h1 className="font-[600] pr-2">
                      {item?.user?.name || "Anonymous"}
                    </h1>
                    <Ratings rating={item?.rating} />
                  </div>
                  <p className="font-[400]">{item?.comment}</p>
                  <p className="text-[#000000a7]">{'2days ago'}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
