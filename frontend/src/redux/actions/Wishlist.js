// add to wishlist
export const addToWishlist = (data) => async (dispatch, getState) => {
  dispatch({
    type: "addToWishlist",   // ✅ must match reducer
    payload: data,
  });

  localStorage.setItem("WishlistItems", JSON.stringify(getState().wishlist.wishlist)); 
  return data;
};

// remove from wishlist
export const removeFromWishlist = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromWishlist", // ✅ already correct
    payload: data._id,
  });

  localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
  return data;
};
