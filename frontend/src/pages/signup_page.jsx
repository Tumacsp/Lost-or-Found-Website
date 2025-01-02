import React from 'react';

const RegisterPage = () => {
  const handleRegister = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log('Form submitted');
    // Add logic to handle registration (e.g., API call)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-200">
      <div className="w-full max-w-md bg-gray-100 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Create an Account</h2>
        <p className="text-gray-600 text-center mb-6">Sign up to get started</p>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password1" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password1"
              type="password"
              placeholder="********"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password2" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="password2"
              type="password"
              placeholder="********"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md shadow-md hover:bg-green-700"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-green-500 hover:underline">Login</a>
          </p>
        </div>
        <p className="text-sm text-gray-500 text-center mt-6">
          By clicking continue, you agree to our{' '}
          <a href="/terms" className="text-green-500 hover:underline">Terms of Service</a> and{' '}
          <a href="/privacy" className="text-green-500 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
