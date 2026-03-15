const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const UserController = require("../controllers/user.controller");
const AuthMiddleware = require("../middlewares/auth.middlewares");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("firstname")
      .isLength({ min: 3 })
      .withMessage("First Name must be at least 3 character long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 character long"),
  ],
  UserController.registerUser,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 character long"),
  ],
  UserController.loginUser,
);

router.get("/profile", AuthMiddleware.authUser, UserController.getProfile);
router.get("/logout", AuthMiddleware.authUser, UserController.logoutUser);

module.exports = router;
