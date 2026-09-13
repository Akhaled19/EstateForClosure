import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { path: "/dashboard", name: "Dashboard" },
  { path: "/inventory", name: "Inventory" },
  { path: "/listings", name: "Listings" },
  { path: "/scan", name: "Scan new item" },
  { path: "/family-friends-owner-view", name: "Family & Friends" }
];


export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate()
  const [openSidebar, setOpenSidebar] = useState(false);
  const [search, setSearch] = useState("");
  const signedIn = localStorage.getItem("token");

  return (
    <div>
      <div className="topbar">
        <button onClick={() => setOpenSidebar(!openSidebar)}
        >
          <Bars3Icon className="w-7" />
        </button>
        <button onClick={() => navigate("/landing-page")}>
          <h2 className="navbar-title" >
            <span className="app-name-left">Estate</span>
            <span className="app-name-right">Foreclosure</span>
          </h2>
        </button>


        <input
          type="text"
          placeholder="Search for anything..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />



      </div>
      {
        openSidebar && (
          <div
            className="sidebar-overlay"
            onClick={() => setOpenSidebar(false)}
          />
        )
      }

      <div className={openSidebar ? "navbar open" : "navbar"}>
        {openSidebar && (
          <button
            onClick={() => setOpenSidebar(false)}
            className="close-sidebar"
          >
            <XMarkIcon className="w-7" />
          </button>
        )}

        <div className="navbar-links">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpenSidebar(false)}
                className={`nav-link ${active ? "active" : ""}`}
              >
                {
                  link.name
                }
              </Link>
            );

          })}
        </div>

        <div className="sidebar-signIn nav-link">
          {signedIn ? (
            <Link
              to="/account"
              onClick={() => setOpenSidebar(false)}
              className="nav-link sidebar-account"
            >
              My Account
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpenSidebar(false)}
              className="nav-link sidebar-login"
            >
              Sign In
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}