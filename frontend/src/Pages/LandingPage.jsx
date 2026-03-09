import React, { useState } from "react";
import Navbar from "../components/Navbar";
import main from "../assets/main.jpg"
function LandingPage() {
  const [destination, setDestination] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Destination:", destination);
  };

  return (
    <>
      <Navbar />

      <div className="landing">
        <div className="left">
          <h1>Go anywhere with Uber</h1>
          <p>Your one stop destination for safe and hassle-free travel.</p>
          <form onSubmit={handleSubmit} className="ride-form">
            <label htmlFor="destination">Enter Destination</label>
            <input
              type="text"
              id="destination"
              name="destination"
              placeholder="Where to?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <button type="submit">Find Ride</button>
          </form>
          <div className="features">
            <div className="feature">
              <h3>Quick Rides</h3>
              <p>Book rides instantly in seconds.</p>
            </div>
            <div className="feature">
              <h3>Secure Payments</h3>
              <p>Pay easily using multiple payment methods.</p>
            </div>
            <div className="feature">
              <h3>Trusted Drivers</h3>
              <p>All drivers are verified and trained.</p>
            </div>
          </div>
        </div>
        <div className="right">
          <img
            src={main}
            alt="Uber Ride"
          />
        </div>
      </div>
    </>
  );
}

export default LandingPage;
