import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Trash2, AlertCircle, CheckCircle2, X } from "lucide-react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import axiosInstance from "../../utils/axios";
import { handleError } from "../../utils/errorHandler";

import Map from "../../components/map/map_show";
import MapDragLaLongComponent from "../../components/map/map_drag";
import AlertModal from "../../components/ui/alert";
import FoundButton from "../../components/ui/postdetail/foundbutton";
import StatusBadge from "../../components/ui/postdetail/statusbadge";
import LocationDetails from "../../components/ui/postdetail/locationdetails";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState(null);
  const [bookMark, setMarked] = useState(false);
  const [location, setLocation] = useState({
    lat: postData?.location?.latitude || 13.764953,
    lon: postData?.location?.longitude || 100.538316,
  });

  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  const [error, setError] = useState("");
  const [addressDetail, setAddressDetail] = useState({
    province: "",
    district: "",
    subdistrict: "",
    road: "",
    postcode: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  };

  // สมมติว่าเรามี currentUser จาก context หรือ localStorage
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [editForm, setEditForm] = useState({
    title: "",
    body_text: "",
    category: "",
    reward: 0,
    location: {
      latitude: 13.764953,
      longitude: 100.538316,
    },
  });

  const fetchPostDetail = async () => {
    try {
      const response = await axiosInstance.get(`api/posts/${id}`);
      setPostData(response.data);
      const check = await axiosInstance.get(`api/bookmark/${id}`);
      setMarked(check.bookmarked)
      setError("");
    } catch (err) {
      handleError(err, setError, navigate);
    } finally {
      setLoading(false);
    }
  };

  const handleFound = async () => {
    try {
      await axiosInstance.post(`/api/posts/found/${id}`);
      setAlertModal({
        isOpen: true,
        type: "success",
        message: "Item marked as found successfully! Thank you for helping.",
      });

      setTimeout(() => {
        setAlertModal({ ...alertModal, isOpen: false });
        navigate("/");
      }, 1500);

      await fetchPostDetail();
    } catch (error) {
      console.error("Error marking post as found:", error);
      setAlertModal({
        isOpen: true,
        type: "error",
        message: "Failed to mark item as found. Please try again.",
      });
    }
  };

  const getAddressFromCoords = async (lat, long) => {
    try {
      const response = await fetch(
        `https://api.longdo.com/map/services/address?` +
          `lon=${long}&lat=${lat}` +
          `&key=${process.env.REACT_APP_LONGDO_MAP_KEY}`
      );

      // ตรวจสอบ response status
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // ตรวจสอบว่า API ส่ง error message มาหรือไม่
      if (data.error) {
        throw new Error(`API error: ${data.error}`);
      }

      // ตรวจสอบว่ามีข้อมูลที่ต้องการหรือไม่
      if (!data.province && !data.district) {
        throw new Error("No address data found for these coordinates");
      }

      setAddressDetail({
        province: data.province || "",
        district: data.district || "",
        subdistrict: data.subdistrict || "",
        road: data.road || "",
        postcode: data.postcode || "",
      });
    } catch (error) {
      console.error("Error fetching address:", error.message);
      setAddressDetail({
        province: "",
        district: "",
        subdistrict: "",
        road: "",
        postcode: "",
      });
      // อาจจะเพิ่มการแสดง error message ให้ user เห็น
      setError(`ไม่สามารถดึงข้อมูลที่อยู่ได้: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [id]);

  useEffect(() => {
    if (postData) {
      setEditForm({
        title: postData.title,
        body_text: postData.body_text,
        category: postData.category,
        status: postData.status,
        reward: postData.reward,
        location: {
          latitude: location.lat,
          longitude: location.lon,
        },
      });
    }
  }, [location, postData]);

  useEffect(() => {
    if (postData?.location) {
      getAddressFromCoords(
        postData.location.latitude,
        postData.location.longitude
      );
    }
  }, [postData]);

  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      // สร้าง FormData เพื่อส่งไฟล์
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("body_text", editForm.body_text);
      formData.append("category", editForm.category);
      formData.append("reward", editForm.reward);
      formData.append("status", editForm.status);
      formData.append("latitude", editForm.location.latitude);
      formData.append("longitude", editForm.location.longitude);

      // formData.forEach((value, key) => {
      //   console.log(key, value);
      // });

      // เพิ่มรูปภาพถ้ามีการเลือก
      if (selectedImage) {
        formData.append("picture_name", selectedImage);
      }

      await axiosInstance.put(`api/posts/edit/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchPostDetail();
      setShowEditModal(false);
      setSuccessMessage("Post updated successfully!");
      setErrorMessage("");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (err) {
      handleError(err, setError, navigate);
      setErrorMessage("Failed to update post. Please try again.");
      setSuccessMessage("");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`api/posts/delete/${id}`);
      setShowDeleteModal(false); // ปิด delete confirmation modal

      setAlertModal({
        isOpen: true,
        type: "success",
        message: "The post has been successfully deleted.",
      });

      setTimeout(() => {
        setAlertModal({ ...alertModal, isOpen: false });
        navigate("/");
      }, 1500);
    } catch (err) {
      handleError(err, setError, navigate);
      setShowDeleteModal(false);

      setAlertModal({
        isOpen: true,
        type: "error",
        message: "Failed to delete post. Please try again.",
      });
    }
  };

  const handleBookmark = async() => {
    try {
      const response = await axiosInstance.post(`api/bookmark/${id}`);
      // console.log(response)
      if (response.status === 201) {
        setMarked(true)
      }else if(response.status === 200){
        const response = await axiosInstance.delete(`api/bookmark/${id}`);
        setMarked(false)
      }
    } catch (error) {
      console.error("Error creating report:", error);
      setAlert({
        isOpen: true,
        type: "error",
        message: error.response?.data?.message || "Error bookmarking",
      });
    }
  }

  const BookmarkSymbol = () => {
    if(bookMark){
      return '★'
    }else{
      return '☆'
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const fileURL = URL.createObjectURL(file);
      setPreviewURL(fileURL);
    }
  };

  function DisplayType({ type }) {
    if (type === "living") {
      return (
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-center mb-4">
            <s>Dead</s> or Alive
          </h1>
        </div>
      );
    } else {
      return (
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-center mb-4">
            Dead or Alive
          </h1>
        </div>
      );
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-120px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {successMessage && (
          <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Left side - Card Preview */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-center mt-2 sm:mt-4">
                Wanted
              </h1>
              <DisplayType type={postData.category} />
              <hr className="h-0.5 border-t-0 bg-neutral-500 my-3 sm:my-4" />

              <div className="flex items-center justify-center my-3 sm:my-4">
                <div className="w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden rounded-lg">
                  <img
                    className="w-full h-full object-contain"
                    src={postData.picture_name}
                    alt={postData.title}
                  />
                </div>
              </div>

              <h1 className="text-lg sm:text-xl lg:text-2xl text-center my-4 sm:my-6 font-bold text-gray-900 relative group">
                <span className="relative inline-block">
                  {postData.title} 
                  <button onClick={handleBookmark}><BookmarkSymbol/></button>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </span>
              </h1>

              <div className="flex justify-center items-center space-x-2 mb-4 sm:mb-6">
                <div className="px-4 sm:px-6 py-2 sm:py-3 bg-green-50 rounded-lg border border-green-100">
                  <span className="text-base sm:text-lg lg:text-xl font-bold text-green-600">
                    ${postData.reward}
                  </span>
                  <span className="ml-2 text-xs sm:text-sm text-green-700">
                    REWARD
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 lg:p-6 shadow-inner">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <span className="w-1 h-6 bg-blue-500 rounded mr-3"></span>
                  Description
                </h3>
                <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line leading-relaxed bg-white p-3 sm:p-4 rounded-lg border border-gray-100">
                  {postData.body_text || "No description available"}
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Details */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
              {/* Header section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Details
                  </h2>
                  <StatusBadge status={postData.status} />
                </div>

                {currentUser.id === postData.user.id && (
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="p-2 sm:p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="Edit post"
                    >
                      <Edit size={20} className="sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-2 sm:p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete post"
                    >
                      <Trash2 size={20} className="sm:w-6 sm:h-6" />
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Posted Date
                </h3>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-gray-600">
                    {new Date(postData.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">
                  Contact Information
                </h3>
                <div className="bg-white p-3 rounded-lg shadow-sm space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Phone: </span>
                    {postData.user?.profile?.phone_number || "Not available"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Email: </span>
                    {postData.user?.email || "Not available"}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">
                    Location
                  </h3>
                  <LocationDetails
                    addressDetail={addressDetail}
                    coordinates={postData.location}
                    error={error}
                    isLoading={loading}
                  />
                </div>

                <div className="mt-4">
                  <Map
                    latitude={postData.location.latitude}
                    longitude={postData.location.longitude}
                  />
                </div>

                <div className="pt-4">
                  <FoundButton
                    post={postData}
                    currentUser={currentUser}
                    handleFound={handleFound}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl transform transition-all">
            <div className="flex items-center space-x-3 mb-6">
              <AlertCircle className="text-red-500 h-8 w-8" />
              <h3 className="text-xl font-bold text-gray-900">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:ring-4 focus:ring-red-200 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all max-w-5xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Post</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-4">📌 Location</h2>
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-xl shadow-md border border-gray-200">
                    <MapDragLaLongComponent
                      onLocationChange={setLocation}
                      initialLocation={{
                        lat: postData?.location?.latitude || 13.764953,
                        lon: postData?.location?.longitude || 100.538316,
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded-md">
                    ✅ Selected location:{" "}
                    <span className="font-medium">
                      {postData?.location?.latitude},{" "}
                      {postData?.location?.longitude}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <form onSubmit={handleEdit} className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition duration-200"
                      placeholder="Enter title"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      Description
                    </label>
                    <textarea
                      value={editForm.body_text}
                      onChange={(e) =>
                        setEditForm({ ...editForm, body_text: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition duration-200"
                      placeholder="Enter description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Category
                      </label>
                      <select
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition duration-200"
                      >
                        <option value="object">Object</option>
                        <option value="living">Living</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Prize ($)
                      </label>
                      <input
                        type="number"
                        value={editForm.reward}
                        onChange={(e) =>
                          setEditForm({ ...editForm, reward: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition duration-200"
                        placeholder="Enter prize amount"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      Image
                    </label>
                    <div className="space-y-4">
                      {postData.picture_name && (
                        <div className="w-full h-48 relative">
                          <img
                            src={previewURL || postData.picture_name}
                            alt="Current"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-4 text-gray-500"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>

                      {selectedImage && (
                        <p className="text-sm text-gray-600">
                          Selected file: {selectedImage.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-6 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-200 transition duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertModal
        isOpen={alertModal.isOpen}
        type={alertModal.type}
        message={alertModal.message}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
      />
    </div>
  );
};

export default PostDetailPage;
