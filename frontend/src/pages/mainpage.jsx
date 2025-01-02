import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const MainPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Welcome to Lost & Found</h2>
          <p className="text-center text-gray-700 mb-6">
            Easily report lost items or find something you've misplaced. Start by exploring the options below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Report a Lost Item</h3>
              <p className="text-gray-600 mb-4">Let us know what you've lost, and we'll help spread the word.</p>
              <a href="/report" className="text-blue-600 hover:underline">Report Now</a>
            </div>
            <div className="p-4 border rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Search for Found Items</h3>
              <p className="text-gray-600 mb-4">Browse items that have been found to see if yours is listed.</p>
              <a href="/search" className="text-blue-600 hover:underline">Search Now</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainPage;
