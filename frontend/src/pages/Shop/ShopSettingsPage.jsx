import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ShopSettings from "../../components/shop/ShopSettings";
import DashboardHeader from "../../components/shop/Layout/DashboardHeader";

const ShopSettingsPage = () => {
  return (
    <div>
      <DashboardHeader />
      <ShopSettings />
      <Footer />
    </div>
  );
};

export default ShopSettingsPage;
