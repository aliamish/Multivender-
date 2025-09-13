import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { backend_url, server } from "../../server";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import styles from "../../styles/style";

const ENDPOINT = "http://localhost:4000/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessages = () => {
  const { seller } = useSelector((state) => state.seller);
  const { user } = useSelector((state) => state.user);

  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [userData, setUserData] = useState(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState();

  const scrollRef = useRef();

  // ✅ incoming socket messages
  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  // ✅ push arrival if in current chat
  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  // ✅ fetch conversations
  useEffect(() => {
    if (!seller?._id) return;
    console.log("Fetching conversations for seller:", seller._id);

    axios
      .get(`${server}/conversation/get-all-conversation-seller/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setConversations(res.data.conversation);
      })
      .catch((error) => console.log(error));
  }, [seller]);

  // ✅ handle online users
  useEffect(() => {
    if (seller?._id) {
      socketId.emit("addUser", seller._id);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  const onlineCheck = (chat) => {
    const otherId = chat.members.find((m) => m !== seller?._id);
    const online = onlineUsers.find((u) => u.userId === otherId);
    return !!online;
  };

  // ✅ fetch messages for selected chat
  useEffect(() => {
    const getMessage = async () => {
      try {
        if (!currentChat?._id) return;
        const res = await axios.get(
          `${server}/message/get-all-messages/${currentChat._id}`
        );
        setMessages(res.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // ✅ auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ send message
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat?._id) return;

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find((m) => m !== seller._id);

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(
        `${server}/message/create-new-message`,
        message
      );
      setMessages((prev) => [...prev, res.data.message]);
      updateLastMessage(newMessage);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ update last message
  const updateLastMessage = async (text) => {
    socketId.emit("updateLastMessage", {
      lastMessage: text,
      lastMessageId: seller._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: text,
        lastMessageId: seller._id,
      })
      .then(() => {
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImages(file);
    imageSendingHandler(file);
  };

  const imageSendingHandler = async (e) => {
    const formData = new FormData();

    formData.append("images", e);
    formData.append("sender", seller._id);
    formData.append("text", newMessage);
    formData.append("conversationId", currentChat._id);

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, formData)
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: seller._id,
      }
    );
  };

  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
      {!open ? (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>
          {conversations.map((item, index) => (
            <MessageList
              key={item._id || index}
              data={item}
              index={index}
              active={active}
              setActive={setActive}
              setOpen={setOpen}
              setCurrentChat={setCurrentChat}
              me={seller._id}
              setUserData={setUserData}
              userData={userData}
              online={onlineCheck(item)}
              setActiveStatus={setActiveStatus}
            />
          ))}
        </>
      ) : (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          seller={seller}
          scrollRef={scrollRef}
          userData={userData}
          activeStatus={activeStatus}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  active,
  setActive,
  setOpen,
  setCurrentChat,
  me,
  userData,
  setUserData,
  online,
  setActiveStatus,
}) => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`?${id}`);
    setOpen(true);
    setCurrentChat(data);
  };

  useEffect(() => {
    setActiveStatus(online);
    const userId = data.members.find((u) => u !== me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setUserData(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [data, me, online, setActiveStatus, setUserData]);

  return (
    <div
      className={`w-full flex p-3 px-3 ${
        active === index ? "bg-[#00000010]" : "bg-transparent"
      } cursor-pointer`}
      onClick={() => setActive(index) || handleClick(data._id)}
    >
      <div className="relative">
        <img
          src={`${backend_url}/${
            userData?.avatar?.url || "uploads/default.png"
          }`}
          alt=""
          className="w-[60px] h-[60px] rounded-full"
        />
        <div
          className={`w-[12px] h-[12px] rounded-full absolute top-[2px] right-[2px] ${
            online ? "bg-green-400" : "bg-[#c7b9b9]"
          }`}
        />
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{userData?.name}</h1>
        <p className="text-[16px] text-[#000c]">
          {data.lastMessageId === me
            ? "You: "
            : `${userData?.name?.[0] || ""}: `}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  seller,
  scrollRef,
  userData,
  activeStatus,
  handleImageUpload,
}) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      {/* header */}
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <img
            src={`${backend_url}/${
              userData?.avatar?.url || "uploads/default.png"
            }`}
            alt=""
            className="w-[60px] h-[60px] rounded-full"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
            <h1>{activeStatus ? "Active Now" : ""}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* messages */}
      <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
        {messages.map((item, index) => {
          const isMine = item.sender === seller._id;
          return (
            <div
              key={item._id || index}
              ref={index === messages.length - 1 ? scrollRef : null}
              className={`flex w-full my-2 ${isMine ? "justify-end" : ""}`}
            >
              {!isMine && (
                <img
                  src={`${backend_url}/${
                    userData?.avatar?.url || "uploads/default.png"
                  }`}
                  className="w-[40px] h-[40px] rounded-full mr-3"
                  alt=""
                />
              )}
              {item.images && (
                <img
                  src={`${backend_url}${item.images}`}
                  className="w-[300px] h-[300px] object-cover rounded-[10px]"
                ></img>
              )}
              <div
                className={`w-max max-w-[70%] p-2 rounded h-min break-words ${
                  isMine ? "bg-[#38c776] text-white" : "bg-gray-300 text-black"
                }`}
              >
                <p>{item.text}</p>
                <p className="text-[10px] opacity-80 pt-1">
                  {format(item.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* input */}
      <form
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[3%]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} />
          </label>
        </div>
        <div className="w-[97%]">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`${styles.input}`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-4 top-5 cursor-pointer"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default DashboardMessages;
