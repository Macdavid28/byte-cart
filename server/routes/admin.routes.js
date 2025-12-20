import express from "express";
import { login, logout } from "../controllers/admin.controller.js";

export const adminRoute = express.Router();

adminRoute.post("/admin/login", login);
adminRoute.post("/admin/logout", logout);
