import express from "express";
import { createCart } from "../controllers/cart.controller.js";
import { verifyToken } from "../middleware/verify-token.js";
export const cartRoutes = express.Router();

cartRoutes.post("/add",verifyToken, createCart)