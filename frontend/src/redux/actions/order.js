import axios from "axios";
import { server } from "../../server";


// get all orders of user
export const getAllOrdersUser = (userId) => async(dispatch) => {
    try {
        dispatch({
            type: "getAllOrdersUserRequest",
        })

        const {data} = await axios.get(`${server}/order/get-all-orders/${userId}`);

        dispatch({
            type: "getAllOrdersUserSuccess",
            payload: data.orders,
        })
    } catch (error) {
        dispatch({
            type: "getAllOrdersUserFailed",
            payload: error.response?.data.message,
        })
    }
}




// get all orders of seller
export const getAllOrdersShop = (shopId) => async (dispatch) => {
  try {
    dispatch({ type: "getAllOrdersShopRequest" });

    // 🟢 Trim shopId to avoid whitespace/newline issues
    const cleanId = shopId?.trim();

    const { data } = await axios.get(
      `${server}/order/get-seller-all-orders/${cleanId}`,
      { withCredentials: true }
    );

    dispatch({
      type: "getAllOrdersShopSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersShopFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// get all orders of admin
export const getAllOrdersOfAdmin = () => async(dispatch) => {
  try {
       dispatch({
        type: "adminAllOrdersRequest",
       });

       const {data} = await axios.get(`${server}/order/admin-all-orders`, { withCredentials: true })

        dispatch({
          type:"adminAllOrdersSuccess",
          payload: data.orders,
        })
  } catch (error) {
     dispatch({
      type: "getAllOrdersShopFailed",
      payload: error.response?.data?.message || error.message,
    }); 
  }
}