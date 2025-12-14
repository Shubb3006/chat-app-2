import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSockMap[userId];
} 

const userSockMap = {}; //{userId:socketId}
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSockMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSockMap)); // it used to send eventts to all connected users

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete userSockMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSockMap)); // it used to send eventts to all connected users
  });

  socket.on("typing",({senderId,receiverId,isTyping})=>{
    const receiverSocketId=userSockMap[receiverId];
    if(receiverSocketId)
      io.to(receiverSocketId).emit("typing",{senderId,isTyping})
  })
});

export { io, app, server };
