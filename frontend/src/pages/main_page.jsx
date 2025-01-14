import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
const MainPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4">Welcome to Lost or Found Website</h2>
          <p className="text-center text-gray-700 mb-6 max-w-2xl mx-auto"> 
            Easily report lost items or find something you've misplaced. Start by exploring the options below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto"> 
            <div className="p-4 sm:p-6 border rounded-lg shadow hover:shadow-lg transition duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Report a Lost Item</h3>
              <p className="text-gray-600 mb-4">Let us know what you've lost, and we'll help spread the word.</p>
              <a href="/report" className="text-blue-600 hover:underline inline-block">Report Now</a>
            </div>
            <div className="p-4 sm:p-6 border rounded-lg shadow hover:shadow-lg transition duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Search for Found Items</h3>
              <p className="text-gray-600 mb-4">Browse items that have been found to see if yours is listed.</p>
              <a href="/search" className="text-blue-600 hover:underline inline-block">Search Now</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainPage;
