import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      // ตรวจสอบ token ก่อนส่ง request
      const token = localStorage.getItem("token");
      console.log("Token before logout request:", token);

      // ตรวจสอบ headers ที่จะส่งไป
      console.log("Current headers:", axiosInstance.defaults.headers.common);

      await axiosInstance.post("auth/logout/");

      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      console.error("Error response:", error.response); // ดูรายละเอียด error response

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        delete axiosInstance.defaults.headers.common["Authorization"];
        setIsLoggedIn(false);
        navigate("/");
      } else {
        alert("Error during logout. Please try again.");
      }
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo and Links on the Left */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2695/2695813.png"
              alt="Logo"
              className="w-10 h-10 mr-2"
            />
            <h1 className="text-black text-xl font-bold pl-2">Lost or Found</h1>
          </div>
          <div className="flex space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-black hover:underline"
            >
              Home
            </Link>
            <Link
              to="/report"
              className="text-gray-700 hover:text-black hover:underline"
            >
              Report
            </Link>
            <Link
              to="/search"
              className="text-gray-700 hover:text-black hover:underline"
            >
              Search
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-black hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Login/Logout Button on the Right */}
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-gray-700 px-4 py-2 border border-gray-700 rounded hover:bg-gray-700 hover:text-white transition duration-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-gray-700 px-4 py-2 border border-gray-700 rounded hover:bg-gray-700 hover:text-white transition duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
