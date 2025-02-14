import {React, useState} from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Poster from "./card";
import { Search } from 'lucide-react';
import hero from '../components/image/HeroImage.webp'

const MainPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gray-100">
          <div className="absolute inset-0">
            <img
              src={hero}
              alt="Lost and Found Illustration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100/80 to-gray-100/80 backdrop-blur-sm" />
          </div>
          
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Lost Something?
                <br />
                <span className="text-blue-600">We're Here to Help</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform connects people who have lost items with those who have found them. Join our community to help reunite lost items with their owners.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <a 
                  href="/report" 
                  className="rounded-md bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-500 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Report Item
                </a>
                <a 
                  href="/search" 
                  className="rounded-md bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Search Items
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"> 
            <div className="p-8 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Report a Lost Item</h3>
              </div>
              <p className="text-gray-600 mb-6 text-lg">Let us know what you've lost, and we'll help spread the word to our community.</p>
              <a href="/report" className="text-blue-600 hover:text-blue-700 inline-flex items-center text-lg font-medium">
                Report Now
                <span className="ml-2">→</span>
              </a>
            </div>
            <div className="p-8 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <Search className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Search for Found Items</h3>
              </div>
              <p className="text-gray-600 mb-6 text-lg">Browse through items that have been found to see if yours is listed.</p>
              <a href="/search" className="text-blue-600 hover:text-blue-700 inline-flex items-center text-lg font-medium">
                Search Now
                <span className="ml-2">→</span>
              </a>
            </div>
          </div>
          <h2 className="text-3xl text-center font-bold text-gray-900 mt-8">Reported Items</h2>
          <div className="mt-8">
            <Poster />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainPage;
