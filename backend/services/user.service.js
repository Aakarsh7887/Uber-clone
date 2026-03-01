const UserModel = require("../models/user.model");

async function createUser({firstname, lastname, email ,password}) {
    if (!firstname || !email || !password) {
        throw new Error("All fields are required.")
    }
    const user = await UserModel.create({ fullname: { firstname, lastname }, email, password });
    const res = user.toObject();
    delete res.password;
    return res;
}

module.exports = {createUser}