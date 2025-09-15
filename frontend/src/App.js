import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRout from "./protectedRout/ProtectedRout.js";
import {
  LoginPage,
  SignUpPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventsPage,
  FaqPage,
  ProductDetailsPage,
  ProfilePage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
  OrderSuccessPage,
  PaymentPage,
  CheckoutPage,
  OrderDetailsPage,
  TrackOrderPage,
  UserInbox,
} from "./protectedRout/Routes.js";
import {
  AdminDashboardPage,
  AdminDashboardUsers,
  AdminDashboardSeller,
  AdminDashboardOrders,
  AdminDashboardProducts,
  AdminDashboardEvents,
  AdminDashboardWithdraw,
} from "./protectedRout/AdminRoutes";
import {
  ShopDashboardPage,
  ShopHomePage,
  ShopCreateProduct,
  ShopAllProducts,
  ShopCreateEvents,
  ShopAllEvents,
  ShopAllCoupouns,
  ShopAllOrders,
  ShopOrderDetails,
  ShopAllRefunds,
  ShopSettingsPage,
  ShopWithDrawMoneyPage,
  ShopInboxPage,
} from "./protectedRout/ShopRout.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from "./redux/store";
import { loadUser } from "./redux/actions/user.js";
import { loadShop } from "./redux/actions/user.js";
import ProtectedAdminRoute from "./protectedRout/ProtectedAdminRoute";
import { useSelector } from "react-redux";
import SellerProtectedRout from "./protectedRout/SellerProtecredRout.js";
import Loader from "./components/layout/loader.jsx";
import { getAllProducts, getAllProductsShop } from "./redux/actions/product.js";
import { getAllEvents, getAllEventsShop } from "./redux/actions/event.js";
import axios from "axios";
import { server } from "./server.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const App = () => {
  const [stripeApikey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get(`${server}/payment/stripeapikey`);

    setStripeApiKey(data.stripeApikey);
  }
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadShop());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllProductsShop());
    Store.dispatch(getAllEventsShop());
    Store.dispatch(getAllEvents());
    getStripeApiKey();
  }, []);

  return (
    <>
      <BrowserRouter>
        {stripeApikey && (
          <Elements stripe={loadStripe(stripeApikey)}>
            <Routes>
              <Route
                path="/payment"
                element={
                  <ProtectedRout isAuthenticated={isAuthenticated}>
                    <PaymentPage />
                  </ProtectedRout>
                }
              />
            </Routes>
          </Elements>
        )}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route
            path="/activation/:activation_token"
            element={<ActivationPage />}
          />
          <Route
            path="/seller/activation/:activation_token"
            element={<SellerActivationPage />}
          />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/best-selling" element={<BestSellingPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRout isAuthenticated={isAuthenticated}>
                <CheckoutPage />
              </ProtectedRout>
            }
          />
          <Route path="/order/success/:id" element={<OrderSuccessPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRout isAuthenticated={isAuthenticated}>
                <ProfilePage />
              </ProtectedRout>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRout isAuthenticated={isAuthenticated}>
                <UserInbox />
              </ProtectedRout>
            }
          />
          <Route
            path="/user/order/:id"
            element={
              <ProtectedRout isAuthenticated={isAuthenticated}>
                <OrderDetailsPage />
              </ProtectedRout>
            }
          />
          {/* SHOP ROUTE */}
          <Route path="/shop-create" element={<ShopCreatePage />} />
          <Route path="/shop-login" element={<ShopLoginPage />} />
          <Route
            path="/shop/:id"
            element={
              <SellerProtectedRout>
                <ShopHomePage />
              </SellerProtectedRout>
            }
          />
          <Route
            path="/dashboard-settings"
            element={
              <SellerProtectedRout>
                <ShopSettingsPage />
              </SellerProtectedRout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <SellerProtectedRout>
                <ShopDashboardPage />
              </SellerProtectedRout>
            }
          />
          <Route
            path="/dashboard-create-product"
            element={
              <SellerProtectedRout>
                <ShopCreateProduct />
              </SellerProtectedRout>
            }
          />
          <Route
            path="/dashboard-orders"
            element={
              <SellerProtectedRout>
                <ShopAllOrders />
              </SellerProtectedRout>
            }
          />
          <Route
            path="/dashboard-refunds"
            element={
              <SellerProtectedRout>
                <ShopAllRefunds />
              </SellerProtectedRout>
            }
          />

          <Route
            path="/order/:id"
            element={
              <SellerProtectedRout>
                <ShopOrderDetails />
              </SellerProtectedRout>
            }
          />
          <Route
            path="/user/track/order/:id"
            element={
              <SellerProtectedRout>
                <TrackOrderPage />
              </SellerProtectedRout>
            }
          />
          <Route
            path="/dashboard-products"
            element={
              <SellerProtectedRout>
                <ShopAllProducts />
              </SellerProtectedRout>
            }
          />

          <Route
            path="/dashboard-create-event"
            element={
              <SellerProtectedRout>
                <ShopCreateEvents />
              </SellerProtectedRout>
            }
          />

          <Route
            path="/dashboard-events"
            element={
              <SellerProtectedRout>
                <ShopAllEvents />
              </SellerProtectedRout>
            }
          />

          <Route
            path="/dashboard-coupouns"
            element={
              <SellerProtectedRout>
                <ShopAllCoupouns />
              </SellerProtectedRout>
            }
          />

          <Route
            path="/dashboard-withdraw-money"
            element={
              <SellerProtectedRout>
                <ShopWithDrawMoneyPage />
              </SellerProtectedRout>
            }
          />

          <Route
            path="/dashboard-messages"
            element={
              <SellerProtectedRout>
                <ShopInboxPage />
              </SellerProtectedRout>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardPage />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin-users"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardUsers />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin-sellers"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardSeller />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin-Orders"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardOrders />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin-products"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardProducts />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin-events"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardEvents />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin-withdraw-request"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardWithdraw />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </BrowserRouter>
    </>
  );
};

export default App;
