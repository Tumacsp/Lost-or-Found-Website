import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { handleError } from "../utils/errorHandler";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("api/profile/");
      setProfile(response.data);
      setError("");
    } catch (err) {
      handleError(err, setError, navigate);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("api/profile/", profile);
      setIsEditing(false);
      setError("");
      setSuccessMessage("Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      handleError(err, setError, navigate);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow">
        <div className="max-w-2xl mx-auto py-8 px-4">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

            {successMessage && (
              <div className="alert alert-success bg-green-100 text-green-700 p-4 mb-4 rounded-lg">
                <strong className="font-bold">Success!</strong> {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {" "}
                {/* Username field */}
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    {" "}
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-300 shadow-sm
                 focus:border-blue-500 focus:ring-blue-500 text-lg"
                  />
                  {error.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {error.username[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled={true}
                    className="mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                 bg-gray-50 text-gray-500 text-lg cursor-not-allowed"
                  />
                </div>
                {/* First Name field */}
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-300 shadow-sm
                 focus:border-blue-500 focus:ring-blue-500 text-lg"
                  />
                </div>
                {/* Last Name field */}
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-300 shadow-sm
                 focus:border-blue-500 focus:ring-blue-500 text-lg"
                  />
                </div>
                {/* Buttons */}
                <div className="flex justify-end space-x-4 mt-8">
                  {" "}
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700
                   text-base font-semibold transition-colors duration-200"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300
                     text-base font-semibold transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700
                     text-base font-semibold transition-colors duration-200"
                      >
                        Save Changes
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
