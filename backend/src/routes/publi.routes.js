"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  getPublication,
  getPublications,
  updatePublication,
  deletePublication,
} from "../controllers/publi.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .get("/posts", getPublications)
  .get("/posts/:id", getPublication)
  .patch("/posts/:id", updatePublication)
  .delete("/posts/:id", deletePublication);

export default router;
