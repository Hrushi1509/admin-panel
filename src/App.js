import React, { useState } from "react";
import "./App.css";
import { CiFilter } from "react-icons/ci";
import { BiSort } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import AllRegisteredUsers from "./components/TableList";
import ProtectedRoute from "./auth/ProtectedRoute";
import Data from "./pages/Data";

function App() {

  const isAuthenticated = !!localStorage.getItem("accessToken");



  return (
    <div className="bg-image">
      <Router>
        <Routes>

          {/* <Route path="/" element={<Navigate to="/get-registred-users" />} /> */}
          <Route path="/" element={<Navigate to="/admin-login" />} />

          <Route path="/admin-login" element={<Login />} />
          <Route path="/signup/" element={<SignUp />} />
          {/* <Route
            path="/get-registred-users"
            element={<AllRegisteredUsers />}
          /> */}

          {/* <Route
            path="/get-registred-users/"
            element={<AllRegisteredUsers />}
          /> */}

          <Route
            path="/get-registred-users/"
            element={ <Data />}
          />

          <Route
            path="/admin-signup/"
            element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<SignUp />} />}
          />
        </Routes>

      </Router>
    </div >
  );
}

export default App;
