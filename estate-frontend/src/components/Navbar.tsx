import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar">

      <Link to="/dashboard">
        Dashboard
      </Link>

      <Link to="/inventory">
        Inventory
      </Link>

      <Link to="/scan">
        Scan new item
      </Link>

      <Link to="/login" className = "login">
        Sign In
      </Link>

    </div>
  );
}