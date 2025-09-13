import React from "react";
import styles from "../../styles/style";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { useState } from "react";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import { useDispatch, useSelector} from "react-redux"
import { getAllSellers } from "../../redux/actions/sellers";
import Loader from "../layout/loader";

const AdminDashboardMain = () => {
  const dispatch = useDispatch()

  const { adminOrders,adminOrderLoading } = useSelector((state) => state.order)
    const { sellers } = useSelector((state) => state.seller)

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers())
  }, [dispatch]);
           
    const adminEarning = adminOrders && adminOrders.reduce((acc,item) => (acc + item.totalPrice) * .10, 0)  
    
    const adminBalance = adminEarning?.toFixed(2)
                                      
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
        <Link to={`/dashboard/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const row = [];
  adminOrders && adminOrders.forEach((item) =>  {
  row.push({
    id: item._id,
    itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
    itemsQty: item?.cart?.length,
    total: item?.totalPrice + " $",
    status: item?.status,
  })});

  return (
      <>
        {
          adminOrderLoading ? (
            <Loader/>
          ) : (
               <div className="w-full p-4">
      <h3 className="text-[25px] font-Poppins pb-2">Overvies</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              Total Earning
              {/* <span className="text-[16px]">(with 10% service change)</span> */}
            </h3>
          </div>

          <h5 className="pt-2 pl-[36px] text-[23px] font-[500]">$ 1200</h5>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              All Sellers
            </h3>
          </div>

          <h5 className="pt-2 pl-[36px] text-[23px] font-[500]">{sellers && sellers.length}</h5>
          <Link to="/admin-sellers">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Sellers</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              All Orders
            </h3>
          </div>

          <h5 className="pt-2 pl-[36px] text-[23px] font-[500]">{adminOrders && adminOrders.length}</h5>
          <Link to="/admin-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
          </Link>
        </div>
      </div>

      <br />
      <h3 className="text-[25px] font-Poppins pb-2">Latest Orders</h3>
      <div className="w-[95%] mx-8 pt-1 mt-10 bg-white">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
          )
        }
      </>
  );
};

export default AdminDashboardMain;
