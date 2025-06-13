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
  // .use(isAdmin);

router
  .get("", getPublications)
  .get("/:id", getPublication)
  .patch("/:id", updatePublication)
  .delete("/:id", deletePublication);

export default router;
