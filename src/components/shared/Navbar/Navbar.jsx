import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import logo from "../../../assets/logo.png";
import Loading from "../../Loading/Loading";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, logOut, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  if (loading) return <Loading></Loading>;

  const handleLogout = () => {
    logOut()
      .then(() => {
        Swal.fire({
          title: "SignOut!",
          text: "You have successfully signed out.",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        navigate("/");
      })
      .catch((error) => {
        console.log(error.massage);
      });
  };

  const navItems = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "text-accent font-bold" : "")}
      >
        Home
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? "text-accent font-bold" : "")}
      >
        About
      </NavLink>

      {user && (
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "text-accent font-bold" : ""
          }
        >
          Dashboard
        </NavLink>
      )}
    </>
  );

  return (
    <div className="backdrop-blur-3xl shadow-md">
      <div className="navbar max-w-11/12 md:max-w-10/11 mx-auto px-0">
        {/* Left: Logo */}
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2 text-xl">
            <img src={logo} alt="" className="w-12 h-12" />
          </Link>
        </div>

        {/* Middle: Nav Links (hidden on small) */}
        <div className="hidden lg:flex lg:gap-4 mr-8">{navItems}</div>

        {/* Right: Auth Buttons */}
        <div className="flex-none gap-2">
          {user ? (
            <>
              <div className="flex items-center gap-4">
                {" "}
                <button
                  onClick={handleLogout}
                  className="btn btn-outline btn-primary btn-sm hidden lg:flex"
                >
                  Sign Out
                </button>
                {/* Optionally show avatar */}
                <div className="avatar">
                  <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={user.photoURL || "/default-avatar.png"}
                      alt="User"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="lg:flex md:gap-5 gap-3 hidden">
                {" "}
                <Link
                  to="/signIn"
                  className="btn btn-outline btn-primary btn-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/signUp"
                  className="btn btn-outline btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden ml-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn btn-primary btn-xs py-4 ml-3"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-base-100 p-4 flex flex-col items-center justify-center shadow-md lg:hidden z-40 min-h-screen space-y-5">
            {navItems}
            <div>
              {user ? (
                <button
                  onClick={logOut}
                  className="btn btn-outline btn-primary btn-sm mt-2"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="btn btn-primary btn-sm mb-2 w-full"
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
    </div>
  );
};

export default Navbar;
