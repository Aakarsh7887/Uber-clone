const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const blackListTokenModel = require("../models/blacklistToken.model");
const rideModel = require("../models/ride.model");
const { validationResult } = require("express-validator");

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, vehicle } = req.body;

  const isCaptainAlreadyExist = await captainModel.findOne({ email });

  if (isCaptainAlreadyExist) {
    return res.status(400).json({ message: "Captain already exist" });
  }

  const hashedPassword = await captainModel.hashPassword(password);

  const captain = await captainService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });

  const token = captain.generateAuthToken();

  res.status(201).json({ token, captain });
};

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email }).select("+password");

  if (!captain) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await captain.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = captain.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, captain });
};

module.exports.getCaptainProfile = async (req, res, next) => {
  const captain = req.captain;

  const stats = await rideModel.aggregate([
    { $match: { captain: captain._id, status: "completed" } },
    {
      $group: {
        _id: null,
        ridesCompleted: { $sum: 1 },
        totalDistance: { $sum: { $ifNull: ["$distance", 0] } },
        totalFare: { $sum: { $ifNull: ["$fare", 0] } },
        totalDuration: { $sum: { $ifNull: ["$duration", 0] } },
      },
    },
  ]);

  const {
    ridesCompleted = 0,
    totalDistance = 0,
    totalFare = 0,
    totalDuration = 0,
  } = stats[0] || {};

  const captainResponse = {
    ...captain.toObject(),
    earnings: totalFare,
    stats: {
      ridesCompleted,
      distanceTravelled: Number((totalDistance / 1000).toFixed(2)),
      hoursOnline: Number((totalDuration / 3600).toFixed(2)),
    },
  };

  res.status(200).json({ captain: captainResponse });
};

module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blackListTokenModel.create({ token });

  res.clearCookie("token");

  res.status(200).json({ message: "Logout successfully" });
};
