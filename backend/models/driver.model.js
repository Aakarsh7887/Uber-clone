const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const driverSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minLength: [3, "firstName must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minLength: [3, "lastName must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: [6, "Password must be at least 6 characters long"],
  },
  address: {
    city: {
      type: String,
      required: true,
      minLength: [3, "city must be at least 3 characters long"],
    },
    state: {
      type: String,
      required: true,
      minLength: [3, "state must be at least 3 characters long"],
    },
    country: {
      type: String,
      required: true,
      minLength: [3, "country must be at least 3 characters long"],
    },
  },
  socketId: {
    type: String,
  },

  vehicle: {
    vehicleType: {
      type: String,
      required: true,
      enum: ["bike", "car", "auto"],
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "capacity must be at least 1"],
    },
    color: {
      type: String,
      minLength: [3, "vehicle color must be at least 3 characters long"],
    },
    regNumber: {
      type: String,
      required: true,
      unique: true,
      minLength: [
        3,
        "vehicle registration number  must be at least 3 characters long",
      ],
    },
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  availability: {
    isOnline: {
      type: Boolean,
      default: false,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    currentRideId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
});

driverSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
  return token;
};

driverSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

driverSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const driverModel = mongoose.model("Driver", driverSchema);

module.exports = driverModel;
