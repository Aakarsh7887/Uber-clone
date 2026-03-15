import React, { useState } from "react";
import Navbar from "../components/Navbar";
import main from "../assets/main.jpg";
function LandingPage() {
  const [destination, setDestination] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Destination:", destination);
  };

  return (
    <>
      <Navbar />

      <div className="landing" id="home">
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
          <div className="features" id="features">
            <div className="feature">
              <h3>Quick Rides</h3>
              <p>Book rides instantly with a tap.</p>
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
          <img src={main} alt="Uber Ride" />
        </div>
      </div>

      <section id="about" style={{ padding: "4rem 2.5rem" }}>
        <h2>About Uber</h2>
        <p
          style={{
            maxWidth: "720px",
            marginTop: "1rem",
            color: "rgba(0,0,0,0.7)",
          }}
        >
          Uber is the leading ride-sharing app connecting riders with reliable
          drivers. Whether it's a quick trip across town or a full day of
          errands, Uber makes it easy to get there.
        </p>
      </section>

      <section
        id="help"
        style={{ padding: "4rem 2.5rem", background: "rgba(255,255,255,0.8)" }}
      >
        <h2>Need Help?</h2>
        <p
          style={{
            maxWidth: "720px",
            marginTop: "1rem",
            color: "rgba(0,0,0,0.7)",
          }}
        >
          Visit our help center or contact support if you have any questions
          about using the platform.
        </p>
      </section>
    </>
  );
}

export default LandingPage;
