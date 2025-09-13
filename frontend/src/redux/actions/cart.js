// add to cart
export const addTocart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "addTocart",   // ✅ must match reducer
    payload: data,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart)); 
  return data;
};

// remove from cart
export const removeFromCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromCart", // ✅ already correct
    payload: data._id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};
