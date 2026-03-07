const DriverModel = require("../models/driver.model");

const registerDriver = async ({
  fullname,
  email,
  password,
  address,
  vehicle,
  location,
}) => {
  if (
    !fullname.firstname ||
    !email ||
    !password ||
    !address.city ||
    !address.state ||
    !address.country ||
    !vehicle.vehicleType ||
    !vehicle.regNumber ||
    !location.latitude ||
    !location.longitude
  ) {
    const error = new Error("All fields are required");
    error.status(400);
    throw error;
  }
  const hashedPassword = await DriverModel.hashPassword(password);

  const newDriver = await DriverModel.create({
    fullname,
    email,
    password: hashedPassword,
    address,
    vehicle,
    location,
  });
  const token = newDriver.generateAuthToken();
  const driver = newDriver.toObject();
  delete driver.password;

  return { token, driver };
};

const loginDriver = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("All fields are required");
    error.status(400);
    throw error;
  }
  let driver = await DriverModel.findOne({ email: email }).select("+password");
  if (!driver) {
    throw new Error("Invalid credentials!");
  }
  const isMatch = driver.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials!");
  }
  const token = driver.generateAuthToken();
  driver = driver.toObject();
  delete driver.password;
  return { token, driver };
};

const getProfile = async ({ _id }) => {
  const driverProfile = await DriverModel.findById(_id);

  if (!driverProfile) {
    throw new Error("No driver found.");
  }
  return driverProfile.toObject();
};

module.exports = { registerDriver, loginDriver, getProfile };
