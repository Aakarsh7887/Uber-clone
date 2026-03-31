import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const CaptainLogout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  React.useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("token");
          navigate("/captain-login");
        }
      })
      .catch((error) => {
        // Fallback cleanup if token was already invalid or missing
        localStorage.removeItem("token");
        navigate("/captain-login");
      });
  }, [token, navigate]);

  return <div>Logging out...</div>;
};

export default CaptainLogout;
