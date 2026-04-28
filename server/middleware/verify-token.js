import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // fetch token from cookies
  const token = req.cookies?.token;
  //  validity check
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No Token Provided" });
  }
  try {
    // decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // check if token is valid
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid" });
    }
    // set the decoded userId and adminId to the request
    req.userId = decoded.userId;
    req.adminId = decoded.adminId;
    req.role = decoded.role;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token expired", expired: true });
    }
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Invalid token" });
  }
};
