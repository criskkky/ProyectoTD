"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import publiRoutes from "./publi.routes.js";

const router = Router();

import cityRoutes from "./city.routes.js";

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/posts", publiRoutes)
    .use("/cities", cityRoutes);

export default router;
