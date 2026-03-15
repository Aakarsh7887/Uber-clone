import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const driver = JSON.parse(localStorage.getItem("driver")) || null;

  const handleLogout = async () => {
    try {
      if (driver) {
        await axiosInstance.post("/drivers/logout");
      } else if (user) {
        await axiosInstance.get("/users/logout");
      }
    } catch (err) {
      console.warn("Failed to logout", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("driver");
    navigate("/");
  };

  const loggedIn = Boolean(user || driver);

  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">
          Uber
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-link">
              Ride
            </Link>
          </li>
          <li>
            <Link to="/captain-register" className="nav-link">
              Drive
            </Link>
          </li>
          <li>
            <a className="nav-link" href="#features">
              Business
            </a>
          </li>
          <li>
            <a className="nav-link" href="#about">
              About
            </a>
          </li>
          <li>
            <a className="nav-link" href="#help">
              Help
            </a>
          </li>
        </ul>
      </div>
      <div className="nav-right">
        {loggedIn ? (
          <>
            <button
              className="btn-secondary"
              onClick={() =>
                navigate(user ? "/user-dashboard" : "/driver-dashboard")
              }
            >
              Dashboard
            </button>
            <button className="btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Login / SignUp
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
