const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const UserService = require("../services/user.service");
const { validationResult } = require("express-validator");

async function registerUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password } = req.body;
  const hashedPassword = await UserModel.hashPassword(password);

  const user = await UserService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

  res.status(201).json({ token, user });
}

module.exports = { registerUser };
