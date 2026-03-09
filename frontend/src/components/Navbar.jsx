import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <div className="navbar">
        <div className="nav-left">
          <h2 className="logo">Uber</h2>
          <ul className="nav-links">
            <li>Ride</li>
            <li>Drive</li>
            <li>Business</li>
            <li>About</li>
            <li>help</li>
          </ul>
        </div>
        <div className="nav-right">
          <button className="btn-primary">Login / SignUp</button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
