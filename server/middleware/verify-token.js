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
    // set the decoded userI to the request id sent to the server
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
