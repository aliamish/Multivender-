import React from "react";
import styles from "../../../styles/style";
import { useSelector } from "react-redux";
import ProductCard from "../productCard/productCard";

const FeaturedProduct = () => {
  const { allProducts } = useSelector((state) => state.products);

  return (
    <div>
      <div className={styles.section}>
        <div className={styles.heading}>
          <h1>Featured Product</h1>
        </div>

        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-10 border-0">
          {allProducts && allProducts.length > 0 ? (
            allProducts.map((item) => (
              <ProductCard data={item} key={item._id} />
            ))
          ) : (
            <p className="text-center w-full col-span-full">No products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
