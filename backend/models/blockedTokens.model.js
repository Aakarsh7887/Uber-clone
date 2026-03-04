const mongoose = require("mongoose");

const blockedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 86400,
  },
});

const blockedTOkenModel = mongoose.model("blockedToken", blockedTokenSchema);

module.exports = blockedTOkenModel;
