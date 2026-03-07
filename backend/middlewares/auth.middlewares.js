const jwt = require("jsonwebtoken");
const blockedTOkenModel = require("../models/blockedTokens.model");

const authUser = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorize" });
  }
  const blockedToken = await blockedTOkenModel.findOne({ token: token });
  if (blockedToken) {
    return res.status(401).json({ message: "Unauthorize" });
  }
  try {
    const isMatch = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!isMatch) {
      return res.status(401).json({ message: "Unauthorize" });
    }
    req.user = isMatch;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { authUser };
