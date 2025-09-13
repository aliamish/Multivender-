import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import styles from "../styles/style";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/Route/productCard/productCard";
import { useSelector } from "react-redux";

const ProductPages = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");

  // ✅ check spelling of state
  const { allProducts } = useSelector((state) => state.products);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      if (categoryData === null) {
        const d = [...allProducts].sort((a, b) => a.sold_out - b.sold_out);
        setData(d);
      } else {
        const d = allProducts.filter((i) => i.category === categoryData);
        setData(d);
      }
    } else {
      setData([]);
    }
  }, [allProducts, categoryData]); // ✅ include categoryData

  return (
    <div>
      <Header activeHeading={3} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5 xl:gap-7 mb-12">
          {data && data.length > 0 ? (
            data.map((i, index) => (
              <ProductCard data={i} key={i._id || index} />
            ))
          ) : (
            <h1 className="text-center w-full pb-[110px] text-2xl">
              No Products Found!
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPages;
