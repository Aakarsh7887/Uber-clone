const { validationResult } = require("express-validator");
const driverService = require("../services/driver.service");
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

module.exports = { registerDriver };
