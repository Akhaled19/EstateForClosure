import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard";
import Inventory from "./pages/inventory";
import Scan from "./pages/scan";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import ItemPage from "./pages/item";


function Layout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/inventory" element={<Inventory />}/>
          <Route path="/scan" element={<Scan />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/items/:id"  element={<ItemPage />}/>
        </Routes>
    </>
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
