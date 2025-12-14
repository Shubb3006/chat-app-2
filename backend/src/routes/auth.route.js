import express from "express";
import {
  login,
  logout,
  signup,
  check,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.post("/logout", logout);

router.get("/check", protectedRoute, check);

router.put("/update-profile", protectedRoute, updateProfile);

export default router;
