const UserModel = require("../models/user.model");

async function createUser({ firstname, lastname, email, password }) {
  if (!firstname || !email || !password) {
    throw new Error("All fields are required.");
  }
  const user = await UserModel.create({
    fullname: { firstname, lastname },
    email,
    password,
  });
  const res = user.toObject();
  delete res.password;
  return res;
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error("All fields are required.");
  }

  const user = await UserModel.findOne({ email: email }).select("+password");
  if (!user) {
    throw new Error("Invalid email or password.");
  }
  const isMatch = await user.comparePassword(password);
  if (isMatch) {
      const token = await user.generateAuthToken();
      const res = user.toObject();
      delete res.password;
    return { token, res };
  } else {
    throw new Error("Invalid User.");
  }
}

module.exports = { createUser, loginUser };
