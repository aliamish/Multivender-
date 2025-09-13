import React, { useEffect, useState } from "react";
import { productData } from "../../static/data";
import styles from "../../styles/style";
import ProductCard from "../Route/productCard/productCard";
import { useSelector } from "react-redux";

const SuggestedProduct = ({ data }) => {
  const {allproducts} = useSelector((state) => state.products);
  const [productdata,setProductData] = useState();

  useEffect(() => {
    const d =
      allproducts && allproducts.filter((i) => i.category === data.category);
    setProductData(d);
  },[]);
  return (
    <div>
      {data ? (
        <div className={`${styles.section}`}>
          <h2
            className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}
          >
            Related Product
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5 xl:gap-7 mb-12">
            {
                productdata && productdata.map((i,index)=>(
                    <ProductCard data={i} key={index}/>
                ))
            }
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SuggestedProduct;
