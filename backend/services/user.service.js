const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

async function createUser({ firstname, lastname, email, password }) {
  if (!firstname || !email || !password) {
    const error = new Error("All fields are required.");
    error.status = 400;
    throw error;
  }
  const hashedPassword = await UserModel.hashPassword(password);
  const res = await UserModel.create({
    fullname: { firstname, lastname },
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ _id: res._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
  const user = res.toObject();
  delete user.password;
  return { token, user };
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    const error = new Error("All fields are required.");
    error.status = 400;
    throw error;
  }

  const user = await UserModel.findOne({ email: email }).select("+password");
  if (!user) {
    const error = new Error("Invalid email or password.");
    error.status = 401;
    throw error;
  }
  const isMatch = await user.comparePassword(password);
  if (isMatch) {
    const token = await user.generateAuthToken();
    const res = user.toObject();
    delete res.password;
    return { token, user: res };
  } else {
    const error = new Error("Invalid email or password.");
    error.status = 401;
    throw error;
  }
}

module.exports = { createUser, loginUser };
