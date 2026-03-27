import jwt from "jsonwebtoken";

export const generateJwt = (res, userId, adminId) => {
  const nodeEnvironment = process.env.NODE_ENV;
  const jwtSecret = process.env.JWT_SECRET;
  const token = jwt.sign({ userId, adminId }, jwtSecret, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: nodeEnvironment === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
};

export const clearAuthCookie = (res) => {
  const nodeEnvironment = process.env.NODE_ENV;
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: nodeEnvironment === "production",
  });
};
