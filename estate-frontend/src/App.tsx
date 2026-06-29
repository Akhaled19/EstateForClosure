import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard";
import Inventory from "./pages/inventory";
import Scan from "./pages/scan";
import Login from "./pages/login";
import SignUp from "./pages/signup";

import { useState } from 'react'


function App() {

  return (
    <BrowserRouter>
      <Navbar /> 


      <Routes>

        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />


      </Routes>

    </BrowserRouter>
  );
}

export default App
