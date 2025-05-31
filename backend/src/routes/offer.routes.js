"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  getOffer,
  getOffers,
  updateOffer,
  deleteOffer,
} from "../controllers/offer.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .get("/", getOffers)
  .get("/:id", getOffer)
  .patch("/:id", updateOffer)
  .delete("/:id", deleteOffer);

export default router;
