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
        to="/"
        className={({ isActive }) => (isActive ? "text-accent font-bold" : "")}
      >
        Home
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? "text-accent font-bold" : "")}
      >
        Donation Requests
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? "text-accent font-bold" : "")}
      >
        Blogs
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? "text-accent font-bold" : "")}
      >
        Funding
      </NavLink>
      <NavLink
        to="/search-page"
        className={({ isActive }) => (isActive ? "text-accent font-bold" : "")}
      >
        Search
      </NavLink>
    </>
  );

  return (
    <div className="backdrop-blur-3xl shadow-md">
      <div className="navbar max-w-11/12 md:max-w-10/11 mx-auto px-0">
        {/* Left: Logo */}
        <div className="flex-1">
          {" "}
          <Link to="/" className="flex items-center gap-2 text-xl">
            <img src={logo} alt="" className="w-12 h-12" />
            <h2 className="text-2xl font-bold text-red-600">LifeDrop</h2>
          </Link>
        </div>

        {/* Middle: Nav Links (hidden on small) */}
        <div className="hidden lg:flex lg:gap-4 mr-8">{navItems}</div>

        {/* Right: Auth Buttons */}
        <div className="flex-none gap-2">
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
                  className="dropdown-content z-[50] mt-3 p-2 shadow-lg bg-white rounded-xl w-56 border"
                >
                  <li>
                    <div className="px-3 py-2">
                      <p className="font-semibold text-sm text-gray-800">
                        {profile.name}
                      </p>
                      <p className="text-xs text-gray-500">{profile.email}</p>
                      <p className="capitalize text-primary">{profile.role}</p>
                    </div>
                  </li>
                  <li>
                    <hr className="my-1" />
                  </li>
                  <li>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md w-full text-left">
                      <LayoutDashboard className="w-4 h-4 text-gray-600" />
                      <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                          isActive ? "text-accent font-bold" : ""
                        }
                      >
                        Dashboard
                      </NavLink>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-600 rounded-md w-full text-left"
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
                    className="btn btn-primary btn-sm mb-2 w-full"
                  >
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn btn-primary btn-sm w-full">
                    Sign Up
                  </Link>
                </>
              )}
              {/* {user ? (
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
              )} */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
