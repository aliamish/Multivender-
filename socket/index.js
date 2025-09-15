const socketIO = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const server = http.createServer(app);

require("dotenv").config({ path: "./.env" });

// ✅ setup socket with proper CORS
const io = socketIO(server, {
  cors: {
    origin: "https://your-frontend.vercel.app", // change to your frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world from socket server!");
});

let users = [];
let messages = {}; // ✅ make global

// add user
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

// remove user
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// get user
const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

// create message with id + seen flag
const createMessage = ({ senderId, receiverId, text, images }) => ({
  id: Date.now().toString(), // unique message id
  senderId,
  receiverId,
  text,
  images,
  seen: false,
});

// ✅ socket connection
io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.id}`);

  // take userId and socketId
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    const message = createMessage({ senderId, receiverId, text, images });

    const user = getUser(receiverId);

    if (!messages[receiverId]) {
      messages[receiverId] = [message];
    } else {
      messages[receiverId].push(message);
    }

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  // mark message seen
  socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
    const user = getUser(senderId);

    if (messages[senderId]) {
      const message = messages[senderId].find(
        (m) => m.receiverId === receiverId && m.id === messageId
      );
      if (message) {
        message.seen = true;

        if (user) {
          io.to(user.socketId).emit("messageSeen", {
            senderId,
            receiverId,
            messageId,
          });
        }
      }
    }
  });

  // update last message
  socket.on("updateLastMessage", ({ lastMessage, lastMessageId }) => {
    io.emit("getLastMessage", { lastMessage, lastMessageId });
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log(`a user disconnected: ${socket.id}`);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`server is running on port ${process.env.PORT || 4000}`);
});
