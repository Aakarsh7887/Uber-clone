import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axios";

function UserLoginPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const navigateToDashboard = () => {
      navigate("/user-dashboard");
    };
    try {
      const response = await axiosInstance.post("/users/login", userData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUserData({
        email: "",
        password: "",
      });
      navigateToDashboard();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="auth-card">
          <h1>Welcome Back!</h1>
          <p>Log into your account to book rides in seconds.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={userData.password}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className="btn-primary">
              Login
            </button>

            <div className="auth-footer">
              <span>New here?</span>
              <Link to="/signup">Create an account</Link>
            </div>
            <div className="auth-footer">
              <span>Driver?</span>
              <Link to="/captain-login">Login as driver</Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default UserLoginPage;
