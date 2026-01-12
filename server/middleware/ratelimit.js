import expressRateLimit from "express-rate-limit";

export const authLimit = expressRateLimit({
  windowMs:15* 60 * 1000,
  max: 20,
  legacyHeaders:true,
  standardHeaders:true,
  keyGenerator:(req)=> req.ip ,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
export const generalLimit = expressRateLimit({
  windowMs:15* 60 * 1000,
  max: 100,
  legacyHeaders:true,
  standardHeaders:true,
  keyGenerator:(req)=> req.ip ,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
