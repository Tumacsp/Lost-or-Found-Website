import React from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Poster from "../card"

const SearchPage = () => {
    function search(){
        console.log("Finding Post with Title:")
    }
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4">Search for Missng reports</h2>
          <div className="flex items-center justify-center p-4">
            <div className="relative">
                <input
                type="text"
                placeholder="Search..."
                className="w-80 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button className="absolute right-2 top-2 text-gray-500" onClick={search}>
                🔍
                </button>
            </div>
            </div>
          <div>
            <Poster />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
