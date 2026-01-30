import express from "express";
import { createCart, getCartForUser } from "../controllers/cart.controller.js";
import { verifyToken } from "../middleware/verify-token.js";
export const cartRoutes = express.Router();

cartRoutes.post("/add",verifyToken, createCart)
cartRoutes.get("/get/user",verifyToken, getCartForUser)
// cartRoutes.post("/get",verifyToken, getCartForUser)