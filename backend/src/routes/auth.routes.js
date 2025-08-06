"use strict";
import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { verifyTurnstile } from "../middlewares/turnstile.middleware.js";

const router = Router();

router
  .post("/login", verifyTurnstile, login)
  .post("/register", verifyTurnstile, register)
  .post("/logout", logout);

export default router;