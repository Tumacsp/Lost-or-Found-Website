import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 p-4 mt-8">
      <div className="container mx-auto text-center text-white">
        <p>&copy; 2025 Lost or Found. All rights reserved.</p>
      </div>
      <h1 className='text-white text-center my-2'>Developers</h1>
      <div className='grid md:grid-cols-2 gap-6 max-w-6xl mx-auto'>
        <p className='text-white text-center'>65070064 <br/>ณภัทร เวชพันธุ์</p>
        <p className='text-white text-center'>65070118 <br/>นันทพงศ์ วิเศษมงคลชัย</p>
      </div>
    </footer>
  );
};

export default Footer;
