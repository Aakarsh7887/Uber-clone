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

module.exports = { registerDriver };
