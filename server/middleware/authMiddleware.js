import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // Read JWT from cookies first, fallback to Authorization header
  const token =
    req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
      });
    }
    req.adminId = decoded.adminId;
    req.userId = decoded.userId;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token expired", expired: true });
    }
    return res
      .status(401)
      .json({ success: false, message: "Invalid token" });
  }
};
