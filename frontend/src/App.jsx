import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element=<LandingPage /> />
      <Route path="/login" element=<LoginPage />></Route>
    </Routes>
  );
}

export default App;
