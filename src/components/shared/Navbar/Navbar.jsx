import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";

const Navbar = () => {
  // const { user, logOut } = use(AuthContext); // assume context provides user & logOut
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? "btn btn-sm btn-ghost rounded-btn text-red-600 font-semibold"
            : "btn btn-sm btn-ghost rounded-btn text-gray-600"
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/donors"
        className={({ isActive }) =>
          isActive
            ? "btn btn-sm btn-ghost rounded-btn text-red-600 font-semibold"
            : "btn btn-sm btn-ghost rounded-btn text-gray-600"
        }
      >
        Donors
      </NavLink>
      <NavLink
        to="/request"
        className={({ isActive }) =>
          isActive
            ? "btn btn-sm btn-ghost rounded-btn text-red-600 font-semibold"
            : "btn btn-sm btn-ghost rounded-btn text-gray-600"
        }
      >
        Request
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive
            ? "btn btn-sm btn-ghost rounded-btn text-red-600 font-semibold"
            : "btn btn-sm btn-ghost rounded-btn text-gray-600"
        }
      >
        About
      </NavLink>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
      {/* Left: Logo */}
      <div className="flex-1">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-red-600"
        >
          <img src="" alt="LifeDrop Logo" className="w-8 h-8" />
          LifeDrop
        </Link>
      </div>

      {/* Middle: Nav Links (hidden on small) */}
      <div className="hidden lg:flex gap-1">{navItems}</div>

      {/* Right: Auth Buttons */}
      <div className="flex-none gap-2">
        {user ? (
          <>
            <button
              onClick={logOut}
              className="btn btn-outline btn-error btn-sm"
            >
              Sign Out
            </button>
            {/* Optionally show avatar */}
            <div className="avatar">
              <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user.photoURL || "/default-avatar.png"} alt="User" />
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/signin" className="btn btn-outline btn-sm">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden ml-2">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="btn btn-ghost"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-base-100 p-4 flex flex-col items-center shadow-md lg:hidden z-40">
          {navItems}
          <div className="mt-2">
            {user ? (
              <button onClick={logOut} className="btn btn-error btn-sm mt-2">
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="btn btn-outline btn-sm mb-2 w-full"
                >
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm w-full">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
