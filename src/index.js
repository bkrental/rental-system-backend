const express = require("express");
const mogran = require("morgan");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const db = require("./config/database");
const {
  jwtStrategy,
  protect,
  decodeToken,
} = require("./middlewares/authMiddleware");
const errorHandler = require("./controllers/errorController");

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const Message = require("./models/message");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

db.connect();

app.use(cors());
app.use(helmet());
app.use(mogran("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
passport.use(jwtStrategy);
app.use(decodeToken);

app.use("/auth", require("./routes/authRoutes"));
app.use("/posts", require("./routes/postRoutes"));
app.use("/images", require("./routes/imageRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/messages", require("./routes/messageRoutes"));

app.get("/", protect, (req, res) => {
  res.send("Hello World!!");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK!");
});

// Error handler
app.use(errorHandler);

const onlineUsers = new Set();
const user2socket = {};

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    const { userId } = data;
    if (!onlineUsers.has(userId)) {
      onlineUsers.add(userId);
      socket.broadcast.emit("online-users-updated", Array.from(onlineUsers));
      user2socket[userId] = socket.id;
    }
  });

  socket.on("send-message", async (data) => {
    const { text, senderId, receiverId } = data;
    console.log("Message received: ", data);

    // Store message to database
    const messageData = { text, sender: senderId, receiver: receiverId };
    const message = new Message(messageData);
    await message.save();

    // Emit event for receiver to update chat
    const receiverSocketId = user2socket[receiverId];
    receiverSocketId &&
      socket
        .to(receiverSocketId)
        .emit("new-message", { text, senderId, receiverId });
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(user2socket)) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        delete user2socket[userId];
        socket.broadcast.emit("online-users-updated", Array.from(onlineUsers));
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
