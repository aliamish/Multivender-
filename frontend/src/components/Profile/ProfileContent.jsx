import React, { useEffect, useState } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/style";
import { Avatar } from "../../assests/asset";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MdOutlineTrackChanges, MdTrackChanges } from "react-icons/md";
import { backend_url, server } from "../../server";
import {
  deleteUserAddress,
  loadUser,
  updateUserAddress,
  updateUserInfromation,
} from "../../redux/actions/user";
import { Country, State } from "country-state-city";
import { getAllOrdersUser } from "../../redux/actions/order"
import { toast } from "react-toastify";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";

const ProfileContent = ({ active }) => {
  const { user, error, SuccessMessage } = useSelector((state) => state.user);
  const avatarUrl = user?.avatar?.url;
  const fullAvatarUrl =
    avatarUrl && !avatarUrl.startsWith("http")
      ? `${avatarUrl.startsWith("/") ? "" : "/"}${avatarUrl}`
      : avatarUrl || Avatar;
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  // const [zipCode, setZipCode] = useState(0);
  // const [address1, setAddress1] = useState("");
  // const [address2, setAddress2] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (SuccessMessage) {
      toast.success(SuccessMessage);
      dispatch({ type: "clearErrors" });
    }
  }, [error, SuccessMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInfromation(name, email, phoneNumber, password));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    const formData = new FormData();

    formData.append("image", e.target.files[0]);

    await axios
      .put(`${server}/user/update-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        dispatch(loadUser())
        toast.success("avatar update successfully!")
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="w-full ">
      {/* PROFILE UPDATE CHANGE */}
      {active === 1 && (
        <>
          <div className=" flex justify-center w-full ">
            <div className="relative">
              <img
                src={fullAvatarUrl}
                onError={(e) => {
                  e.target.src = Avatar;
                }}
                className="w-36 h-36 border-green-700 rounded-full border-3"
                alt="User Avatar"
              />
              <div className="w-[30px] h-[30px]  bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-1 right-1">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleImage}
                />
                <label htmlFor="image">
                  <AiOutlineCamera />
                </label>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full px-5">
            <form onSubmit={handleSubmit}>
              {/*  PERSOND ABOUT DETAILS */}
              <div className="w-full 800px:flex pb-3">
                <div className=" w-full 800px:w-[50%]">
                  <label className="block pb-2">full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className=" w-full 800px:w-[50%]">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] 800px:mb-0`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full 800px:flex pb-3">
                <div className=" w-full 800px:w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className=" w-full 800px:w-[50%]">
                  <label className="block pb-2">Enter your password</label>
                  <input
                    type="password"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* <div className=" w-full 800px:w-[50%]">
                  <label className="block pb-2">Zip Code</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%]  800px:mb-0`}
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div> */}
                {/* </div>
              <div className="w-full 800px:flex pb-3">
                <div className="w-full 800px:w-[50%]">
                  <label className="block pb-2">Address 1</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                  />
                </div> */}
                {/* <div className="w-full 800px:w-[50%]">
                  <label className="block pb-2">Address 2</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                  />
                </div> */}
              </div>
              <input
                type="submit" // fix: lowercase "submit"
                value="Update"
                required
                className="w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer"
              />
            </form>
          </div>
        </>
      )}

      {/* ORDERS PAGE  */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}

      {/* REFUND PAGE */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}

      {/* TRACK ORDER PAGE */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/* CHANGEPASSWORD */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}

      {/* USER ADDRESS PAGE */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
    const {user} = useSelector((state) => state.user)

  const {orders} = useSelector((state) => state.order)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersUser(user._id));
  }, [])
  

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "status",
      minWidth: 130,
      flex: 0.7,
      // fix: should be cellClassName, not callClassName
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty", // fix: use camelCase consistently
      headerName: "ItemsQty",
      type: "number", // fix: use lowercase 'number'
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number", // fix: lowercase
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: "actions", // fix: empty field name replaced with 'actions'
      headerName: "",
      type: "number",
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const rows = [];

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$" + item.totalPrice,
        status: item.status,
      });
    });
  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};
const AllRefundOrders = () => {
    const {user} = useSelector((state) => state.user)

  const {orders} = useSelector((state) => state.order)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersUser(user._id));
  }, [])

  const eligibleOrders = orders && orders.filter((item) => item.status === "Processing refund")
  

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "status",
      minWidth: 130,
      flex: 0.7,
      // fix: should be cellClassName, not callClassName
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty", // fix: use camelCase consistently
      headerName: "ItemsQty",
      type: "number", // fix: use lowercase 'number'
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number", // fix: lowercase
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: "actions", // fix: empty field name replaced with 'actions'
      headerName: "",
      type: "number",
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const rows = [];

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$" + item.totalPrice,
        status: item.status,
      });
    }
  )
  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};
const TrackOrder = () => {
    const {user} = useSelector((state) => state.user)

  const {orders} = useSelector((state) => state.order)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersUser(user._id));
  }, [])
  

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "status",
      minWidth: 130,
      flex: 0.7,
      // fix: should be cellClassName, not callClassName
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty", // fix: use camelCase consistently
      headerName: "ItemsQty",
      type: "number", // fix: use lowercase 'number'
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number", // fix: lowercase
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: "actions", // fix: empty field name replaced with 'actions'
      headerName: "",
      type: "number",
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/trsck/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const rows = [];

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$" + item.totalPrice,
        status: item.status,
      });
    });
  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};
const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    await axios.put(
      `${server}/user/update-user-password`,
     { oldPassword,
      newPassword,
      confirmPassword,},
      { withCredentials: true }
    ).then((res) => {
      toast.success(res.data.success);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("")
    }).catch((error) => {
      toast.error(error.response.data.message)
    })
  }; 
  return (
    <div className="w-full px-5">
      <h1 className="block text-xl font-[600] text-center text-[#000000ba]">
        Change Password
      </h1>
      <div className="w-full">
        <form
          aria-required
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className=" w-full 800px:w-[50%] mt-5">
            <label className="block pb-2">Enter your old password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className=" w-full 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your new password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className=" w-full 800px:w-[50%]">
            <label className="block pb-2">Enter your confirm password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              type="submit" // fix: lowercase "submit"
              value="Update"
              required
              className="w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer"
            />
          </div>
        </form>
      </div>
      {/* <div className={`${styles.button} !rounded-md`}>
          <span className="text-white">Add new</span>
        </div>
      </div>
      <br />
      <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10">
        <div className="flex items-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnqz0qtXghh1ZHImnO8LmHcfMqTz6c0VILSQ&s"
            alt=""
            className="h-[20px]"
          />
          <h5 className="pl-5 font-[600] text-2xl">ali</h5>
        </div>
        <div className="pl-8 flex items-center">
          <h6>123 ********** </h6>
          <h5 className="pl-6"> 08/25</h5>
        </div>
        <div className="min-w-[10%] flex items-center justify-between pl-8 ">
          <AiOutlineDelete size={25} className="cursor-pointer" />
        </div>
      </div> */}
    </div>
  );
};
const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ];

  const handleSubmit = async (e) => {
    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(
        updateUserAddress(country, city, address1, address2, zipCode, addressType)
      );
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode(null);
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    dispatch(deleteUserAddress(item._id));
  };

  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center">
          <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center text-[25px] font-Poppins">
              Add New Address
            </h1>
            <div className="w-full">
              <form aria-required onSubmit={handleSubmit} className="w-full">
                <div className="w-full block p-4">
                  <div className="w-full pb-2">
                    <label className="block border pb-2">Country</label>
                    <select
                      name=""
                      id=""
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px]"
                    >
                      <option value="" className="block pb-2">
                        choose your country
                      </option>
                      {Country.getAllCountries().map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <label className="block border pb-2">
                      Choose your City
                    </label>
                    <select
                      name=""
                      id=""
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px]"
                    >
                      <option value="" className="block pb-2">
                        choose your city
                      </option>
                      {State.getStatesOfCountry(country).map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <label className="block border pb-2">Address 1</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>
                  <div className="w-full pb-2">
                    <label className="block border pb-2">Address 2</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block border pb-2">Zid Code</label>
                    <input
                      type="number"
                      className={`${styles.input}`}
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block border pb-2">Address Type</label>
                    <select
                      name=""
                      id=""
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px]"
                    >
                      <option value="" className="block pb-2">
                        choose your Address Type
                      </option>
                      {addressTypeData.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <input
                      type="submit"
                      className={`${styles.input} mt-5 cursor-pointer`}
                      required
                      readOnly
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="w-full px-5 flex items-center justify-between">
        <h1 className="text-xl font-[600] text-[#000000ba]">My Address</h1>
        <div
          className={`${styles.button} !rounded-md`}
          onClick={() => setOpen(true)}
        >
          <span className="text-white">Add new</span>
        </div>
      </div>
      <br />
      {user &&
        user.addresses.map((item, index) => (
          <div
            className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10"
            key={index}
          >
            <div className="flex items-center">
              <h5 className="pl-5 font-[600] text-2xl">{item.addressType}</h5>
            </div>
            <div className="pl-8 flex items-center">
              <h6>
                {item.address1} + {item.address2}
              </h6>
            </div>
            <div className="pl-8 flex items-center">
              <h6>{user && user.phoneNumber} </h6>
            </div>
            <div className="min-w-[10%] flex items-center justify-between pl-8 ">
              <AiOutlineDelete
                size={25}
                className="cursor-pointer"
                onClick={() => handleDelete(item)}
              />
            </div>
          </div>
        ))}
      {user && user.addresses.length === 0 && (
        <h5 className="text-center pt-10 text-[18px]">
          you not have any saved address!
        </h5>
      )}
    </div>
  );
};
export default ProfileContent;
