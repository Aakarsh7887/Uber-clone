import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axios";

function UserDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/users/profile");
      setProfile(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch profile. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.get("/users/logout");
    } catch (err) {
      console.warn("Logout request failed", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />
      <main className="dashboard">
        <div className="dashboard-card">
          <header className="dashboard-header">
            <h1>
              Welcome back
              {profile?.fullname?.firstname
                ? `, ${profile.fullname.firstname}`
                : ""}
              !
            </h1>
            <button className="btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </header>
          {loading ? (
            <p>Loading profile...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="profile-details">
              <div className="profile-row">
                <span className="label">Name</span>
                <span>
                  {profile.fullname.firstname} {profile.fullname.lastname}
                </span>
              </div>
              <div className="profile-row">
                <span className="label">Email</span>
                <span>{profile.email}</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default UserDashboard;
