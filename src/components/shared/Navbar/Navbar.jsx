import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import logo from "../../../assets/logo.png";
import Loading from "../../Loading/Loading";
import Swal from "sweetalert2";
import useAxios from "../../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { LogOut, LayoutDashboard } from "lucide-react";
import ThemeToggle from "../../../ThemeToggle/ThemeToggle";

const Navbar = () => {
  const { user, logOut, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const axiosInstance = useAxios();

  const navigate = useNavigate();

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

  // Fetch profile data
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/email?email=${user.email}`);
      return res.data;
    },
  });

  if (loading || isLoading) return <Loading></Loading>;
  if (isError)
    return <div className="text-center mt-10">Failed to load profile.</div>;

  const navItems = (
    <>
      <NavLink
        onClick={() => setMenuOpen(!menuOpen)}
        to="/"
        className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}
      >
        Home
      </NavLink>

      <NavLink
        onClick={() => setMenuOpen(!menuOpen)}
        to="/donation-request"
        className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}
      >
        Donation Requests
      </NavLink>

      <NavLink
        onClick={() => setMenuOpen(!menuOpen)}
        to="/blogs"
        className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}
      >
        Blogs
      </NavLink>

      <NavLink
        onClick={() => setMenuOpen(!menuOpen)}
        to="/funding-page"
        className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}
      >
        Funding
      </NavLink>
      <NavLink
        onClick={() => setMenuOpen(!menuOpen)}
        to="/search-page"
        className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}
      >
        Search
      </NavLink>
    </>
  );

  return (
    <div className="backdrop-blur-3xl shadow-md shadow-secondary dark:shadow-accent bg-base-100">
      <div className="navbar max-w-11/12 md:max-w-10/11 mx-auto px-0">
        {/* Left: Logo */}
        <div className="flex-1">
          {" "}
          <Link to="/" className="flex items-center gap-2 text-xl">
            <img src={logo} alt="" className="w-12 h-12" />
            <h2 className="text-2xl font-bold text-primary">LifeDrop</h2>
          </Link>
        </div>

        {/* Middle: Nav Links (hidden on small) */}
        <div className="hidden lg:flex lg:gap-4 mr-8">{navItems}</div>

        {/* Right: Auth Buttons */}
        <div className="flex justify-center gap-2 items-center">
          <ThemeToggle></ThemeToggle>

          {user ? (
            <>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="avatar w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 cursor-pointer transition-transform hover:scale-105"
                >
                  <img
                    src={profile.avatar || "/default-avatar.png"}
                    alt="User"
                    className="rounded-full object-cover"
                  />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[50] mt-3 p-2 shadow-lg bg-base-100 rounded-xl w-56 border border-secondary"
                >
                  <li>
                    <div className="px-3 py-2">
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-300">
                        {profile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {profile.email}
                      </p>
                      <p className="capitalize text-primary">{profile.role}</p>
                    </div>
                  </li>
                  <li>
                    <hr className="my-2" />
                  </li>
                  <li>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md w-full text-left">
                      <LayoutDashboard className="w-4 h-4 text-gray-600" />
                      <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                          isActive ? "text-primary font-bold" : ""
                        }
                      >
                        Dashboard
                      </NavLink>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-secondary dark:hover:text-white text-primary rounded-md w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </li>
                </ul>
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
              {!user && (
                <>
                  <Link
                    to="/signin"
                    className="btn btn-outline btn-primary btn-sm mb-2 w-full"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-outline btn-primary btn-sm w-full"
                  >
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
