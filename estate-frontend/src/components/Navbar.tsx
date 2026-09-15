import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth";

const navLinks = [
  { path: "/dashboard", name: "Dashboard", requiresAuth: false },
  { path: "/inventory", name: "Inventory", requiresAuth: false },
  { path: "/listings", name: "Listings", requiresAuth: false },
  { path: "/scan", name: "Scan new item", requiresAuth: false },
  { path: "/family-friends-owner-view", name: "Family & Friends", requiresAuth: true }
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate()
  const [openSidebar, setOpenSidebar] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { session } = useAuth();

  const permittedNavLinks = navLinks.filter((link) => !link.requiresAuth || session);

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
          className="search-bar hidden sm:block"
        />

        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="sm:hidden ml-auto"
        >
          <MagnifyingGlassIcon className="w-6" />
        </button>

      </div>

      {mobileSearchOpen && (
        <div className="sm:hidden px-4 py-2.5 bg-white border-b-2 border-gray-200">
          <input
            type="text"
            autoFocus
            placeholder="Search for anything..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar w-full ml-0"
          />
        </div>
      )}

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
          {permittedNavLinks.map((link) => {
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
          {session ? (
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