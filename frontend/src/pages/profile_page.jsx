import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Lock, X } from "lucide-react";
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
    profile_picture: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("api/profile/");
      console.log("Fetched Profile Data:", response.data);

      setProfile(response.data);
      setPreviewImage(response.data.profile_picture);
      setError("");
    } catch (err) {
      handleError(err, setError, navigate);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", profile.username);
      formData.append("first_name", profile.first_name);
      formData.append("last_name", profile.last_name);

      if (profile.profile_picture instanceof File) {
        formData.append("profile_picture", profile.profile_picture);
      }

      await axiosInstance.put("api/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      setPasswordError("New passwords do not match");
      return;
    }
    try {
      const response = await axiosInstance.post(
        "api/profile/change-password/",
        {
          old_password: passwords.old_password,
          new_password: passwords.new_password,
        }
      );

      // Update token if provided
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        // Update axios instance authorization header
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Token ${response.data.token}`;
      }

      setSuccessMessage("Password changed successfully!");
      setPasswords({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      setIsModalOpen(false);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password"
      );
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setPreviewImage(URL.createObjectURL(file));
        setProfile((prev) => ({
          ...prev,
          profile_picture: file,
        }));
      } catch (err) {
        console.error("Error handling image:", err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors duration-200"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            </div>

            {successMessage && (
              <div className="alert alert-success bg-green-100 text-green-700 p-4 mb-4 rounded-lg">
                <strong className="font-bold">Success!</strong> {successMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <label
                      htmlFor="profile-upload"
                      className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
                    >
                      <Camera className="w-5 h-5" />
                      <input
                        type="file"
                        id="profile-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {isEditing
                    ? "Click the camera icon to update your profile picture"
                    : ""}
                </p>
              </div>

              {/* Right Column - Profile Information */}
              <div className="md:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={profile.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
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
                      className="mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-500 text-lg cursor-not-allowed"
                    />
                  </div>

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
                      className="mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                    />
                  </div>

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
                      className="mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 mt-8">
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-base font-semibold transition-colors duration-200"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setPreviewImage(profile.profile_picture);
                          }}
                          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-base font-semibold transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-base font-semibold transition-colors duration-200"
                        >
                          Save Changes
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full m-4 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Change Password</h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="old_password"
                  value={passwords.old_password}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  value={passwords.new_password}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={passwords.confirm_password}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;
