import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, Users, FileText, Power } from "lucide-react";
import { logout } from "../../../utils/auth";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 flex-col items-center justify-center rounded-md bg-blue-600 p-4 md:h-40"
        to="/admin-dashboard"
      >
        <img
          className="h-8 w-8 md:h-12 md:w-12 mb-2 md:mb-4 brightness-0 invert"
          src="https://cdn-icons-png.flaticon.com/512/2695/2695813.png"
          alt="Logo"
        />
        <div className="text-white text-center font-medium">
          Lost & Found Admin
        </div>
      </Link>
      <div className="flex grow flex-col gap-2">
        <NavLink to="/admin-dashboard" icon={Home} text="Dashboard" />
        <NavLink to="/admin-dashboard/users" icon={Users} text="Users" />
        <NavLink to="/admin-dashboard/posts" icon={FileText} text="Posts" />
        <div className="flex-grow" />
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-md p-2 text-gray-500 hover:bg-gray-100"
        >
          <Power className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

const NavLink = ({ to, icon: Icon, text }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 rounded-md p-2 ${
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{text}</span>
    </Link>
  );
};

export default Sidebar;
