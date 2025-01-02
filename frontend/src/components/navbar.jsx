import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo and Links on the Left */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <img src="https://cdn-icons-png.flaticon.com/512/2695/2695813.png" alt="Logo" className="w-10 h-10 mr-2" />
            <h1 className="text-black text-xl font-bold pl-2">Lost or Found</h1>
          </div>
          <div className="flex space-x-6">
            <a href="/" className="text-gray-700 hover:text-black hover:underline">Home</a>
            <a href="/report" className="text-gray-700 hover:text-black hover:underline">Report</a>
            <a href="/search" className="text-gray-700 hover:text-black hover:underline">Search</a>
            <a href="/contact" className="text-gray-700 hover:text-black hover:underline">Contact</a>
          </div>
        </div>

        {/* Login Button on the Right */}
        <div>
          <a
            href="/login"
            className="text-gray-700 px-4 py-2 border border-gray-700 rounded hover:bg-gray-700 hover:text-white transition duration-200"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
