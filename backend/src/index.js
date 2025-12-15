import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import statusRoutes from "./routes/status.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import path from "path";
import { app, io, server } from "./lib/socket.js";
dotenv.config();

const PORT = process.env.PORT;

const __dirname = path.resolve();

// This will allow us to extract json data out of the body
app.use(cookieParser()); //
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://full-stack-chat-app-f6fa.onrender.com/",
    ],
    credentials: true,
  })
); //

app.use("/api/auth", authRoutes); // for api calls it will go to auth.route.js
app.use("/api/messages", messageRoutes); // for api calls about messages it will go to auth.route.js
app.use("/api/status", statusRoutes); // for api calls about messages it will go to auth.route.js

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.use((req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
//   });
// }

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(distPath));

  app.use((req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server is running at PORT:" + PORT);
  connectDB();
});
