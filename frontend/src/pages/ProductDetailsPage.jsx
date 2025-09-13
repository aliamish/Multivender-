import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductDetails from "../components/Products/ProductDetails.jsx";
import { useParams, useSearchParams } from "react-router-dom";
import { productData } from "../static/data.js";
import SuggestedProduct from "../components/Products/SuggestedProduct.jsx";
import { useSelector } from "react-redux";

const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");

  useEffect(() => {
    const data = allProducts && allProducts.find((i) => i._id === id);
    setData(data);
  }, [allProducts]);
  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {eventData && (
        <>
          data && <SuggestedProduct data={data} />
        </>
      )}
      <Footer className="mb-10 " />
    </div>
  );
};

export default ProductDetailsPage;
