import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard";
import Inventory from "./pages/inventory";
import Listings from "./pages/listings";
import Scan from "./pages/scan";
import Login from "./pages/login";
import SignUp from "./pages/signup";

function Layout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className = "flex min-h-screen bg-white"> 
      {!hideNavbar && <Navbar />}
      <div className = "flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/inventory" element={<Inventory />}/>
          <Route path="/listings" element={<Listings />}/>
          <Route path="/scan" element={<Scan />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<SignUp />}/>
        </Routes>
      </div>
    </div>
  )
}

function App() {

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App
