import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

const VerifyTokenPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axiosInstance.post('auth/verify-token/', { token });
      navigate(`/reset-password/${token}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="w-full max-w-md bg-gray-100 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Enter Verification Code
        </h2>
        <p className="text-gray-600 text-center mb-6">
          We sent a verification code to your email address
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter code from email here"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{' '}
            <button 
              onClick={() => navigate('/forgotpassword')}
              className="text-blue-600 hover:underline"
            >
              Request new code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyTokenPage;
