const { validationResult } = require("express-validator");
const driverService = require("../services/driver.service");
const blockedTOkenModel = require("../models/blockedTokens.model");
const registerDriver = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullname, email, password, address, vehicle, location } = req.body;
    const newDriver = await driverService.registerDriver({
      fullname,
      email,
      password,
      address,
      vehicle,
      location,
    });

    return res.status(201).json({ newDriver });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginDriver = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const driver = await driverService.loginDriver({ email, password });
    return res.status(200).json({ driver });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logoutDriver = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (token) {
      const blockedToken = await blockedTOkenModel.create({ token: token });
      if (blockedToken) {
        return res.status(200).json({ message: "Logged out successfully" });
      }
    }
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    const profile = await driverService.getProfile({ _id });
    return res.status(200).json({ profile });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = { registerDriver, loginDriver, logoutDriver, getProfile };
