import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { register } from "../../utils/auth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await register(formData);
      navigate("/");
    } catch (err) {
      setErrors(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-200">
      <div className="w-full max-w-md bg-gray-100 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Create an Account
        </h2>
        <p className="text-gray-600 text-center mb-6">Sign up to get started</p>

        {errors.non_field_errors && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.non_field_errors.join(", ")}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your Username"
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
              required
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.join(", ")}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.join(", ")}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.join(", ")}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password_confirm"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="password_confirm"
              type="password"
              value={formData.password_confirm}
              onChange={handleChange}
              placeholder="********"
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.password_confirm ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
              required
            />
            {errors.password_confirm && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password_confirm.join(", ")}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md shadow-md hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
