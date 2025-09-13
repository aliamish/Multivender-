import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import Loader from "../layout/loader";
import { DataGrid } from "@mui/x-data-grid";
import { getAllOrdersShop } from "../../redux/actions/order";
import { Button } from "@mui/material";

const AllRefundsOrders = () => {
  const dispatch = useDispatch();

  // ✅ state slices
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  // ✅ fetch seller orders on mount
  useEffect(() => {
    if (seller?._id) {
      console.log("Fetching orders for shopId:", `"${seller._id}"`);
      dispatch(getAllOrdersShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const refundOrders = orders && orders.filter((item) => item.status === "Processing refund" || item.status === "Refund Success");

  // ✅ define columns
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.value === "Delivered" ? "greenColor" : "redColor",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  // ✅ build rows for DataGrid
  const rows = refundOrders?.map((item) => ({
    id: item._id,
    itemsQty: item.cart?.length || 0,
    total: "US$ " + item.totalPrice,
    status: item.status,
  })) || [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllRefundsOrders;
