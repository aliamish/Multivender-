import { createReducer } from "@reduxjs/toolkit";

// ✅ Safe parse for cart
let cartItems = [];
try {
  const stored = localStorage.getItem("cartItems");
  if (stored && stored !== "undefined") {
    cartItems = JSON.parse(stored);
  }
} catch (error) {
  console.error("Invalid cartItems in localStorage:", error);
  localStorage.removeItem("cartItems"); 
}

const initialState = {
  cart: cartItems,
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addTocart", (state, action) => {
      const item = action.payload;
      const isItemExist = state.cart.find((i) => i._id === item._id);

      if (isItemExist) {
        state.cart = state.cart.map((i) =>
          i._id === isItemExist._id ? item : i
        );
      } else {
        state.cart.push(item);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    })

    .addCase("removeFromCart", (state, action) => {
      state.cart = state.cart.filter((i) => i._id !== action.payload);

      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    });
});
