"use strict";
import { Router } from "express";
import { authenticateJwt, flexAuthJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  getPublication,
  getPublications,
  updatePublication,
  deletePublication,
  createPublication
} from "../controllers/publi.controller.js";

const router = Router();

router
  .get("/", getPublications)
  .get("/:id", flexAuthJwt, getPublication)

router
  .use(authenticateJwt)
  // .use(isAdmin);

router
  .patch("/:id", updatePublication)
  .delete("/:id", deletePublication)
  .post("/", createPublication);

export default router;
