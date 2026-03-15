import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axios";

function DriverLoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axiosInstance.post("/drivers/login", credentials);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("driver", JSON.stringify(response.data.driver));
      navigate("/driver-dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="auth-card">
          <h1>Driver Login</h1>
          <p>Access your driver dashboard and manage rides.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </label>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="btn-primary">
              Login
            </button>

            <div className="auth-footer">
              <span>Don't have an account?</span>
              <Link to="/captain-register">Register as a driver</Link>
            </div>
            <div className="auth-footer">
              <span>Rider?</span>
              <Link to="/login">Login as rider</Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default DriverLoginPage;
