import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  wishlist: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
};

export const wishlistReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToWishlist", (state, action) => {
      const item = action.payload;
      const isItemExist = state.wishlist.find((i) => i._id === item._id);

      if (isItemExist) {
        state.wishlist = state.wishlist.map((i) =>
          i._id === isItemExist._id ? item : i
        );
      } else {
        state.wishlist.push(item);
      }

      // ✅ save to localStorage every time cart updates
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    })

    .addCase("removeFromCart", (state, action) => {
      state.wishlist = state.wishlist.filter((i) => i._id !== action.payload);

      // ✅ update localStorage after removing
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    });
});
