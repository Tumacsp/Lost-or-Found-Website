import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { logout, isAuthenticated, isStaffUser } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setIsStaff(isStaffUser());
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      alert("Error during logout. Please try again.");
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side: Logo and navigation */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-8 md:h-10 md:w-10"
                src="https://cdn-icons-png.flaticon.com/512/2695/2695813.png"
                alt="Logo"
              />
              <span className="ml-2 text-xl font-bold">Lost or Found</span>
            </Link>

            <div className="hidden md:flex md:items-center md:space-x-4 ml-6">
              <Link
                to="/"
                className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition duration-200"
              >
                Home
              </Link>
              <Link
                to="/search"
                className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition duration-200"
              >
                Search
              </Link>
              <Link
                to="/report"
                className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition duration-200"
              >
                Report
              </Link>
              <Link
                to="/bookmark"
                className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition duration-200"
              >
                Bookmark
              </Link>
            </div>
          </div>
          {/* Right side: Profile and Auth buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isLoggedIn ? (
              <>
                {/* staff */}
                {isStaff && (
                  <Link
                    to="/admin-dashboard"
                    className="px-4 py-2 text-gray-700 bg-gray-300 border border-gray-400 
               rounded-lg shadow-md hover:bg-gray-400 hover:text-white 
               hover:shadow-lg transition-all duration-200"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {/* profile */}
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition duration-200"
                >
                  <User className="w-5 h-5 mr-2" />
                  Profile
                </Link>
                {/* logout */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/search"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Search
            </Link>

            <Link
              to="/report"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Report
            </Link>

            <Link
              to="/bookmark"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Bookmark
            </Link>

            {isLoggedIn ? (
              <>
                {/* staff */}
                {isStaff && (
                  <Link
                    to="/admin-dashboard"
                    className="block px-4 py-2 text-gray-800 font-semibold bg-gray-200 
               rounded-lg shadow-md hover:bg-gray-300 hover:text-gray-900 
               hover:shadow-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* profile */}
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>

                {/* logout */}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
