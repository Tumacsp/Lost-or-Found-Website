import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("auth/logout/");
      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      console.error("Error response:", error.response);

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
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-8 md:h-10 md:w-10"
                src="https://cdn-icons-png.flaticon.com/512/2695/2695813.png"
                alt="Logo"
              />
              <span className="ml-2 text-xl font-bold">Lost or Found</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/"
              className="px-3 py-2 text-gray-700 hover:text-black hover:underline"
            >
              Home
            </Link>
            <Link
              to="/report"
              className="px-3 py-2 text-gray-700 hover:text-black hover:underline"
            >
              Report
            </Link>
            <Link
              to="/search"
              className="px-3 py-2 text-gray-700 hover:text-black hover:underline"
            >
              Search
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 text-gray-700 hover:text-black hover:underline"
            >
              Contact
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-gray-700 border border-gray-700 rounded hover:bg-gray-700 hover:text-white transition duration-200"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 text-gray-700 border border-gray-700 rounded hover:bg-gray-700 hover:text-white transition duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-black hover:underline"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/report"
              className="block px-3 py-2 text-gray-700 hover:text-black hover:underline"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Report
            </Link>
            <Link
              to="/search"
              className="block px-3 py-2 text-gray-700 hover:text-black hover:underline"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Search
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-gray-700 hover:text-black hover:underline"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 border border-gray-700 rounded hover:bg-gray-700 hover:text-white transition duration-200"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 border border-gray-700 rounded hover:bg-gray-700 hover:text-white transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
