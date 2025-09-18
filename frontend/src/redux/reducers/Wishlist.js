import { createReducer } from "@reduxjs/toolkit";

// Helper to sync with localStorage
const saveToLocalStorage = (wishlist) => {
  localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
};

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

      saveToLocalStorage(state.wishlist);
    })

    .addCase("removeFromWishlist", (state, action) => {
      state.wishlist = state.wishlist.filter((i) => i._id !== action.payload);
      saveToLocalStorage(state.wishlist);
    })

    .addCase("clearWishlist", (state) => {
      state.wishlist = [];
      saveToLocalStorage(state.wishlist);
    });
});
