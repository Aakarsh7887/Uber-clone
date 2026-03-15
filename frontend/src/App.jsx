import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import UserLoginPage from "./Pages/UserLoginPage";
import UserSignUp from "./Pages/UserSignUp";
import UserDashboard from "./Pages/UserDashboard";
import DriverLoginPage from "./Pages/DriverLoginPage";
import DriverSignUp from "./Pages/DriverSignUp";
import DriverDashboard from "./Pages/DriverDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/signup" element={<UserSignUp />} />

      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/captain-login" element={<DriverLoginPage />} />
      <Route path="/captain-register" element={<DriverSignUp />} />

      <Route
        path="/driver-dashboard"
        element={
          <ProtectedRoute role="driver">
            <DriverDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
