import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { path: "/dashboard", name: "Dashboard"},
  { path: "/inventory", name: "Inventory"},
  { path: "/listings", name: "Listings"},
  { path: "/scan", name: "Scan new item"}
];


export default function Navbar() {
  const location = useLocation();
  return (
    <div className="navbar">

      <h2 className = "navbar-title"> 
        <span className = "app-name-left"> Estate </span>
        <span className = "app-name-right"> Forclosure </span> 
        </h2>

      <div className = "navbar-links"> 
        {navLinks.map((link) => {
          const active = location.pathname === link.path;

          return (
            <Link
            key = {link.path}
            to = {link.path}
            className = {`nav-link ${active ? "active" : ""}`}
            > 
            {
              link.name
            }
            </Link>
          );
        
        })}
        </div>

        <Link to = "/login" className = "nav-link login">
        Sign In
        
        </Link>


    </div>
  );
}