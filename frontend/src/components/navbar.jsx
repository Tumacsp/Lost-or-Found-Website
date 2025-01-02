import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Lost & Found</h1>
        <ul className="flex space-x-4">
          <li><a href="/" className="text-white hover:underline">Home</a></li>
          <li><a href="/report" className="text-white hover:underline">Report</a></li>
          <li><a href="/search" className="text-white hover:underline">Search</a></li>
          <li><a href="/contact" className="text-white hover:underline">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;