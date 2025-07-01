const { verifyToken } = require("../utils/jwt");

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Bạn chưa đăng nhập hoặc thiếu token truy cập",
      code: "AUTH_MISSING_TOKEN",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
