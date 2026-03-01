const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(`${process.env.DB_URL}/uber-db`);
    console.log("DataBase Connected Successfully");
  } catch (error) {
    console.error("Error connecting DataBase : " + error.message);
  }
}

module.exports = {connectDB}
