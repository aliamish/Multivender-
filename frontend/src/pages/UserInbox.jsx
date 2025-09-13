import React, { useEffect, useState, useRef } from "react";
import Header from "../components/layout/Header";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { backend_url, server } from "../server";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../styles/style";

const ENDPOINT = "http://localhost:4000/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const UserInbox = () => {
  const { user } = useSelector((state) => state.user);

  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [active, setActive] = useState(0);
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState();

  const scrollRef = useRef();

  // ✅ listen for incoming messages
  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        images: data.images || null,
        createdAt: Date.now(),
      });
    });
  }, []);

  // ✅ push arrival message if sender is in current chat
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  // ✅ fetch conversations
  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`${server}/conversation/get-all-conversation-user/${user._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setConversations(res.data.conversation);
      })
      .catch((error) => console.log(error));
  }, [user]);

  // ✅ add user to socket
  useEffect(() => {
    if (user) {
      const userId = user._id;
      socketId.emit("addUser", userId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  // ✅ check online
  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    const online = onlineUsers.find((u) => u.userId === chatMembers);
    return online ? true : false;
  };

  // ✅ fetch messages for selected chat
  useEffect(() => {
    const getMessage = async () => {
      try {
        if (!currentChat?._id) return;
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // ✅ auto scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ send new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socketId.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage.trim() !== "") {
        const res = await axios.post(
          `${server}/message/create-new-message`,
          message
        );

        setMessages((prev) => [...prev, res.data.message]);
        updateLastMessage();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ update last message in conversation
  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: user._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: user._id,
      })
      .then(() => {
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // ✅ image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImages(file);
    imageSendingHandler(file);
  };

  const imageSendingHandler = async (file) => {
    const formData = new FormData();
    formData.append("images", file);
    formData.append("sender", user._id);
    formData.append("text", newMessage);
    formData.append("conversationId", currentChat._id);

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socketId.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      images: file,
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
        lastMessageId: user._id,
      }
    );
  };

  return (
    <div>
      <Header />

      {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>

          {/* All conversations list */}
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                active={active}
                setActive={setActive}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={user._id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
              />
            ))}
        </>
      )}

      {open && (
        <UserChatBox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          user={user}
          scrollRef={scrollRef}
          userData={userData}
          activeStatus={activeStatus}
          handleImageUpload={handleImageUpload} // ✅ Pass here
        />
      )}
    </div>
  );
};

/* ✅ Conversation List Item */
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
  const [chatUser, setChatUser] = useState(null);
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    setActiveStatus(online);

    const userId = data.members.find((user) => user !== me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setChatUser(res.data.user);
        setUserData(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  return (
    <div
      className={`w-full flex p-3 px-3 ${
        active === index ? "bg-[#00000010]" : "bg-transparent"
      } cursor-pointer`}
      onClick={() =>
        setActive(index) || handleClick(data._id) || setCurrentChat(data)
      }
    >
      <div className="relative">
        <img
          src={`${backend_url}/${chatUser?.avatar.url}`}
          alt=""
          className="w-[60px] h-[60px] rounded-full"
        />
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
        ) : (
          <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
        )}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{chatUser?.name}</h1>
        <p className="text-[16px] text-[#000c]">
          {data.lastMessage !== chatUser?._id ? "You:" : `${chatUser?.name}:`}{" "}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

/* ✅ Chat Box */
const UserChatBox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  user,
  scrollRef,
  userData,
  activeStatus,
  handleImageUpload, // ✅ Add here
}) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      {/* header */}
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <img
            src={`${backend_url}/${userData?.avatar.url}`}
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
        {messages &&
          messages.map((item, index) => (
            <div key={index} ref={scrollRef}>
              {item.sender === user._id ? (
                /* ✅ My Message → RIGHT SIDE */
                <div className="flex w-full justify-end my-2">
                  <div>
                    <div className="w-max p-2 rounded bg-[#38c776] text-white h-min">
                      {item.images ? (
                        <img
                          src={`${backend_url}/${item.images}`}
                          alt="sent"
                          className="w-[200px] h-auto rounded"
                        />
                      ) : (
                        <p>{item.text}</p>
                      )}
                    </div>
                    <p className="text-[12px] text-[#000000d3] pt-1">
                      {format(item.createdAt)}
                    </p>
                  </div>
                </div>
              ) : (
                /* ✅ Received Message → LEFT SIDE */
                <div className="flex w-full my-2">
                  <img
                    src={`${backend_url}/${userData?.avatar.url}`}
                    className="w-[40px] h-[40px] rounded-full mr-3"
                    alt=""
                  />
                  <div className="w-max p-2 rounded bg-gray-300 text-black h-min">
                    {item.images ? (
                      <img
                        src={`${backend_url}/${item.images}`}
                        alt="received"
                        className="w-[200px] h-auto rounded"
                      />
                    ) : (
                      <p>{item.text}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* input */}
      <form
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[3%]">
          <input
            type="file"
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

export default UserInbox;
