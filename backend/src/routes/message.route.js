import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
  getMessages,
  sendMessage,
  usersList,
} from "../controllers/message.controller.js";
const router = express.Router();

router.get("/users", protectedRoute, usersList);

router.get("/:id", protectedRoute, getMessages);

router.post("/send-message/:id", protectedRoute, sendMessage);

export default router;
