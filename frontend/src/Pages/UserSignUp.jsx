import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axios";

function UserSignUp() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post("/users/register", userData)
      .then((response) => {
        alert("Registration successfull! ");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUserData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
        });
        navigate("/user-dashboard");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="auth-card">
          <h1>Welcome to Uber</h1>
          <p>Just a few steps to get you on the road.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="grid-2">
              <label>
                First Name
                <input
                  type="text"
                  name="firstname"
                  placeholder="Enter your firstname"
                  value={userData.firstname}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Last Name
                <input
                  type="text"
                  name="lastname"
                  placeholder="Enter your lastname"
                  value={userData.lastname}
                  onChange={handleChange}
                />
              </label>
            </div>

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
              Create Account
            </button>

            <div className="auth-footer">
              <span>Looking to drive?</span>
              <Link to="/captain-register">Register as a driver</Link>
            </div>
            <div className="auth-footer">
              <span>Already have an account?</span>
              <Link to="/login">Login Here</Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default UserSignUp;
