import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axios";

function DriverSignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    city: "",
    state: "",
    country: "",
    vehicleType: "car",
    capacity: 4,
    color: "",
    regNumber: "",
    latitude: "",
    longitude: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      fullname: {
        firstname: form.firstname,
        lastname: form.lastname,
      },
      email: form.email,
      password: form.password,
      address: {
        city: form.city,
        state: form.state,
        country: form.country,
      },
      vehicle: {
        vehicleType: form.vehicleType,
        capacity: Number(form.capacity),
        color: form.color,
        regNumber: form.regNumber,
      },
      location: {
        latitude: Number(form.latitude) || 0,
        longitude: Number(form.longitude) || 0,
      },
    };

    try {
      const response = await axiosInstance.post("/drivers/register", payload);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("driver", JSON.stringify(response.data.driver));
      navigate("/driver-dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    }
  };

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="auth-card auth-card--wide">
          <h1>Driver Sign up</h1>
          <p>Register as a driver and start accepting rides.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="grid-2">
              <label>
                First name
                <input
                  type="text"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Last name
                <input
                  type="text"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            <div className="grid-3">
              <label>
                City
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                State
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Country
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className="grid-3">
              <label>
                Vehicle type
                <select
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                  required
                >
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="auto">Auto</option>
                </select>
              </label>
              <label>
                Capacity
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  min={1}
                  required
                />
              </label>
              <label>
                Color
                <input
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label>
              Vehicle Reg. Number
              <input
                type="text"
                name="regNumber"
                value={form.regNumber}
                onChange={handleChange}
                required
              />
            </label>

            <div className="grid-2">
              <label>
                Latitude
                <input
                  type="number"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  step="any"
                />
              </label>
              <label>
                Longitude
                <input
                  type="number"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  step="any"
                />
              </label>
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="btn-primary">
              Create Driver Account
            </button>

            <div className="auth-footer">
              <span>Already have an account?</span>
              <Link to="/captain-login">Login here</Link>
            </div>

            <div className="auth-footer">
              <span>Rider?</span>
              <Link to="/signup">Sign up as rider</Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default DriverSignUp;
