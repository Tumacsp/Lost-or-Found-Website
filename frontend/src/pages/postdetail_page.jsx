import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Trash2, AlertCircle, X } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../utils/axios";
import { handleError } from "../utils/errorHandler";
import Map from "../components/map/map_show";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState(null);

  const [error, setError] = useState("");
  const [addressDetail, setAddressDetail] = useState({
    province: "",
    district: "",
    subdistrict: "",
    road: "",
    postcode: "",
  });

  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // สมมติว่าเรามี currentUser จาก context หรือ localStorage
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [editForm, setEditForm] = useState({
    title: "",
    body_text: "",
    category: "",
    reward: 0,
  });

  const fetchPostDetail = async () => {
    try {
      const response = await axiosInstance.get(`api/posts/${id}`);
      setPostData(response.data);
      setError("");
    } catch (err) {
      handleError(err, setError, navigate);
    } finally {
      setLoading(false);
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
      });
    }
  }, [postData]);

  useEffect(() => {
    if (postData?.location) {
      getAddressFromCoords(
        postData.location.latitude,
        postData.location.longitude
      );
    }
  }, [postData]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`api/posts/${id}`, editForm);
      fetchPostDetail();
      setShowEditModal(false);
    } catch (err) {
      handleError(err, setError, navigate);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`api/posts/${id}`);
      navigate("/");
    } catch (err) {
      handleError(err, setError, navigate);
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
                  <span
                    className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium ${
                      postData.status === "resolved"
                        ? "bg-green-100 text-green-800"
                        : postData.status === "active"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {postData.status === "resolved"
                      ? "Found"
                      : postData.status === "active"
                      ? "Searching"
                      : "Closed"}
                  </span>
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

              <div className="space-y-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Description
                  </h3>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-gray-700 whitespace-pre-line text-base leading-relaxed">
                      {postData.body_text}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">
                    Location
                  </h3>
                  {error ? (
                    <p className="text-red-500 text-sm sm:text-base">{error}</p>
                  ) : addressDetail.province ? (
                    <div className="space-y-2 sm:space-y-3">
                      {addressDetail.road && (
                        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                          <span className="font-bold text-gray-700 w-32">
                            Road:
                          </span>
                          <span className="text-gray-600">
                            {addressDetail.road}
                          </span>
                        </div>
                      )}
                      {addressDetail.subdistrict && (
                        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                          <span className="font-bold text-gray-700 w-32">
                            Sub-district:
                          </span>
                          <span className="text-gray-600">
                            {addressDetail.subdistrict}
                          </span>
                        </div>
                      )}
                      {addressDetail.district && (
                        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                          <span className="font-bold text-gray-700 w-32">
                            District:
                          </span>
                          <span className="text-gray-600">
                            {addressDetail.district}
                          </span>
                        </div>
                      )}
                      {addressDetail.province && (
                        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                          <span className="font-bold text-gray-700 w-32">
                            Province:
                          </span>
                          <span className="text-gray-600">
                            {addressDetail.province}
                          </span>
                        </div>
                      )}
                      {addressDetail.postcode && (
                        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                          <span className="font-bold text-gray-700 w-32">
                            Postal Code:
                          </span>
                          <span className="text-gray-600">
                            {addressDetail.postcode}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                        <span className="font-semibold text-gray-700 min-w-[100px] sm:min-w-[120px] text-sm sm:text-base">
                          Coordinates:
                        </span>
                        <span className="text-gray-600 text-sm sm:text-base">
                          ({postData.location.latitude},{" "}
                          {postData.location.longitude})
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
                      <p className="text-sm sm:text-base text-gray-600">
                        Loading location...
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <Map
                    latitude={postData.location.latitude}
                    longitude={postData.location.longitude}
                  />
                </div>

                {postData.status === "active" && (
                  <div className="pt-4">
                    <button className="w-full py-3 sm:py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl">
                      Found it!
                    </button>
                  </div>
                )}
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
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Post</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

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
      )}
    </div>
  );
};

export default PostDetailPage;
