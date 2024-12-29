require('dotenv').config();
const express = require("express");
const chat = require("./data/data");
const connectDB = require("./config/database");
const userRoutes = require("./Routes/userRoutes");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const path = require("path");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json()); // to parse the body of the request and get the data in json format

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ******************Deployments*********************

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// ******************Deployments*********************

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io server");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("setup", userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("joined room", room);
    // io.to(data.room).emit("message", data);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recived", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("disconnected from socket.io server");
    socket.leave(userData._id);
  });
});

connectDB();
