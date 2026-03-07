const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const UserService = require("../services/user.service");
const blockedTOkenModel = require("../models/blockedTokens.model");
const { validationResult } = require("express-validator");

async function registerUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password } = req.body;

    const user = await UserService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password,
    });

    res.status(201).json({ user });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
  }
}

async function loginUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await UserService.loginUser({ email, password });

    res.status(200).json(user);
  } catch (error) {
    res.status(error.status || 401).json({ message: error.message || "Unauthorized" });
  }
}

const getProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await UserModel.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (token) {
      await blockedTOkenModel.create({ token: token });
    }
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser, getProfile, logoutUser };
