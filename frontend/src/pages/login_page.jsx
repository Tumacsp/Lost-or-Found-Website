import React from 'react';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="w-full max-w-md bg-gray-100 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Welcome back</h2>
        <p className="text-gray-600 text-center mb-6">Login to your Lost or Found account</p>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">Forgot your password?</a>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </div>
        <p className="text-sm text-gray-500 text-center mt-6">
          By clicking continue, you agree to our{' '}
          <a href="/terms" className="text-blue-500 hover:underline">Terms of Service</a> and{' '}
          <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
