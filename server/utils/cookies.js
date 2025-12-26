import jwt from "jsonwebtoken";
export const generateJwt = (res, userId, adminId) => {
  const nodeEnvironment = process.env.NODE_ENV;
  const jwtSecret = process.env.JWT_SECRET;
  const token = jwt.sign({ userId, adminId }, jwtSecret, {
    expiresIn: "10m",
  });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: nodeEnvironment === "production",
    maxAge: 10 * 60 * 1000, //10 minutes
  });
  return token;
};
