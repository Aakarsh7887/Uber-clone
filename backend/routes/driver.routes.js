const express = require("express");
const { body } = require("express-validator");
const driverController = require("../controllers/driver.controller");
const Authmiddleware = require("../middlewares/auth.middlewares");
const router = express.Router();

router.post(
  "/register",
  [
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("firstname must be 3 characters long!"),
    body("email").isEmail().withMessage("Invalid Email!"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("password must be 6 characters long!"),
    body("address.city")
      .isLength({ min: 3 })
      .withMessage("city must be 3 characters long!"),
    body("address.state")
      .isLength({ min: 3 })
      .withMessage("state must be 3 characters long!"),
    body("address.country")
      .isLength({ min: 3 })
      .withMessage("country must be 3 characters long!"),
  ],
  driverController.registerDriver,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 character long!"),
  ],
  driverController.loginDriver
);

router.post("/logout", Authmiddleware.authUser, driverController.logoutDriver);

router.get("/profile", Authmiddleware.authUser, driverController.getProfile);

module.exports = router;
