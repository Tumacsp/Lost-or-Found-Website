import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <p className="text-2xl font-semibold text-gray-700 mt-4">
            Page Not Found
          </p>
          <p className="text-gray-600 mt-2">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <a
            href="/"
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Go Back Home
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
