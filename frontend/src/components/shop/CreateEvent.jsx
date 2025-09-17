import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { createevent } from "../../redux/actions/event";
const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.events);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscouontPrice] = useState("");
  const [stock, setStock] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    setStartDate(startDate);
    setEndDate(null);
    document.getElementById("end-date").min = minEndDate.toISOString().slice(
      0,
      10
    );
  };

  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };

  const today = new Date().toISOString().slice(0, 10);

  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : today;
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Event created Successfuly");
      navigate("/dashboard-events");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!images.length) {
    return toast.error("Please upload at least one image!");
  }

  if (!startDate || !endDate) {
    return toast.error("Please select start and end dates!");
  }

  const eventData = {
    name,
    description,
    category,
    tags,
    originalPrice,
    discountPrice,
    stock,
    shopId: seller._id,
    Start_Date: startDate.toISOString(),   // ✅ match backend schema
    Finish_Date: endDate.toISOString(),    // ✅ match backend schema
    images, // array of strings
  };

  dispatch(createevent(eventData));
};

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);

    for (let file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "ecommrence"); // must exist in your Cloudinary
      data.append("cloud_name", "du6xqru9r");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/du6xqru9r/image/upload",
          data
        );

        if (res.data.secure_url) {
          setImages((prev) => [...prev, res.data.secure_url]); // ✅ store Cloudinary URLs
        } else {
          toast.error("Image upload failed!");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error uploading image");
      }
    }
  };

  return (
    <div className=" w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] p-3 overflow-y-scroll">
      <h5 className="text-xl font-Poppins text-center">Create Event</h5>
      {/* CREATE EVENT FORM */}
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border mt-2 appearance-none block w-full px-3  h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your event Product Name"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            rows="8"
            required
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border mt-2 appearance-none block w-full pt-2 px-3  h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter Your event Product  Description ..."
          >
            {" "}
          </textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a Category"> Choose a Category</option>
            {categoriesData &&
              categoriesData.map((i) => (
                <option value={i.title} key={i.title}>
                  {i.title}
                </option>
              ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border mt-2 appearance-none block w-full px-3  h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your event product  Tags..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
            type="text"
            name="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="border mt-2 appearance-none block w-full px-3  h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your event Product Price"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Price (with Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="number"
            value={discountPrice}
            onChange={(e) => setDiscouontPrice(e.target.value)}
            className="border mt-2 appearance-none block w-full px-3  h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your event product Discount Price"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border mt-2 appearance-none block w-full px-3  h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your event Product Stock"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Event Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="price"
            id="start-date"
            value={startDate ? startDate.toISOString().slice(0, 10) : ""}
            onChange={handleStartDateChange}
            min={today}
            className="border mt-2 appearance-none block w-full px-3  h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your event Product Stock"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Event End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="price"
            id="end-date"
            value={endDate ? endDate.toISOString().slice(0, 10) : ""}
            onChange={handleEndDateChange}
            min={minEndDate}
            className="border mt-2 appearance-none block w-full px-3  h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your event Product Stock"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageSubmit}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} color="#555" className="mt-2" />
            </label>
            {images &&
              images.map((i,index) => (
                <img
                  src={URL.createObjectURL(i)}
                  key={index}
                  alt=""
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
          </div>
          <br />
          <div>
            <input
              type="submit"
              value="Create"
              className="border mt-2 appearance-none block w-full px-3  h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
