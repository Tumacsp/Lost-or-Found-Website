import {React, useState} from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Poster from '../card';

import { handleError } from "../../utils/errorHandler";
const Bookmark = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4">Bookmark</h2>
          <p className="text-center text-gray-700 mb-6 max-w-2xl mx-auto"> 
            Easily report lost items or find something you've misplaced. Start by exploring the options below.
          </p>
          <div>
            <Poster />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bookmark;
