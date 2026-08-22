import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard";
import Inventory from "./pages/inventory";
import Listings from "./pages/listings";
import Scan from "./pages/scan";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import ItemPage from "./pages/item";
import FamilyShare from "./pages/FamilyShare.tsx";
import FamilyFriends from "./pages/FamilyFriendsOwner.tsx";
import Review from "./pages/review";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";


function Layout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup", "/forgot-password", "/reset-password"].includes(location.pathname);

  return (
    <div className = " min-h-screen bg-white"> 
      {!hideNavbar && <Navbar />}
      <div className = "overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/inventory" element={<Inventory />}/>
          <Route path="/listings" element={<Listings />}/>
          <Route path="/scan" element={<Scan />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/items/:id"  element={<ItemPage />}/>
          <Route path="/estateItemsF&F/:ownerID" element={<FamilyShare />}/>
          <Route path="/family-friends-owner-view" element={<FamilyFriends />}/>
          <Route path="/items/:id/review" element={<Review />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
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
