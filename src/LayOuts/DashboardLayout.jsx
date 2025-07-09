import { Menu, X } from "lucide-react"; // You can use any icon lib
import { useState } from "react";
import logo from "../assets/logo.png"; // Adjust path as needed
import { Link, NavLink, Outlet } from "react-router";
import { Home, User, Droplet, Users, LayoutDashboard } from "lucide-react";

const DashboardLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform transform ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <Link
          to={"/"}
          className="flex items-center gap-2 p-4 border-b border-b-primary"
        >
          <img src={logo} alt="LifeDrop" className="w-10 h-10" />
          <h1 className="text-xl font-bold text-primary">LifeDrop</h1>
        </Link>
        <nav className="flex flex-col p-4 gap-2">
          <NavLink
            onClick={() => setDrawerOpen(!drawerOpen)}
            to="/dashboard"
            end
            className={({ isActive }) =>
              isActive
                ? "btn btn-sm btn-ghost justify-start bg-red-100 text-red-600 font-semibold"
                : "btn btn-sm btn-ghost justify-start"
            }
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard Home
          </NavLink>

          <NavLink
            onClick={() => setDrawerOpen(!drawerOpen)}
            to="/dashboard/profile"
            className={({ isActive }) =>
              isActive
                ? "btn btn-sm btn-ghost justify-start bg-red-100 text-red-600 font-semibold"
                : "btn btn-sm btn-ghost justify-start"
            }
          >
            <User className="w-4 h-4 mr-2" />
            My Profile
          </NavLink>

          <NavLink
            to="/dashboard/create-donation-request"
            className={({ isActive }) =>
              isActive
                ? "btn btn-sm btn-ghost justify-start bg-red-100 text-red-600 font-semibold"
                : "btn btn-sm btn-ghost justify-start"
            }
          >
            <Droplet className="w-4 h-4 mr-2" />
            Donation Requests
          </NavLink>

          {/* Future example for donor list or admin panel */}
          {/* 
  <NavLink to="/dashboard/donors" className={({ isActive }) => isActive ? "..." : "..."}>
    <Users className="w-4 h-4 mr-2" />
    All Donors
  </NavLink> 
  */}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Navbar */}
        <div className="flex items-center justify-between bg-white shadow-md px-4 py-3 md:hidden">
          <button onClick={() => setDrawerOpen(!drawerOpen)}>
            {drawerOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="LifeDrop" className="w-8 h-8" />
            <h1 className="text-lg font-bold text-primary">LifeDrop</h1>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
