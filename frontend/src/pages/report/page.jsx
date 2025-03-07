import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import MapComponent from "../../components/map/map_api";
import axiosInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../components/ui/alert";
import { UserCircle, Package } from "lucide-react";

const ReportPage = () => {
  const [file, setFile] = useState();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("object");
  const [details, setDetails] = useState("");
  const [reward, setReward] = useState(0);
  const [imageInfo, setImageInfo] = useState({ fileName: "", path: "" });
  const [location, setLocation] = useState({ lat: 13.764953, lon: 100.538316 });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!details.trim()) {
      newErrors.details = "Details are required";
    }
    if (!file) {
      newErrors.image = "Image is required";
    }
    if (isNaN(reward) || reward < 0) {
      newErrors.reward = "Please enter a valid reward amount";
    }
    return newErrors;
  };

  function handleImageChange(e) {
    try {
      const uploadedFile = e.target.files[0];
      if (uploadedFile) {
        setImageInfo({
          fileName: uploadedFile.name,
          path: e,
        });
        setFile(URL.createObjectURL(uploadedFile));
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({ ...prev, image: "Error uploading image" }));
    }
  }

  function handleTitleChange(e) {
    setTitle(e.target.value);
    if (e.target.value.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.title;
        return newErrors;
      });
    }
  }

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  function handleDetailsChange(e) {
    setDetails(e.target.value);
    if (e.target.value.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.details;
        return newErrors;
      });
    }
  }

  function handleRewardChange(e) {
    setReward(e.target.value);
    if (!isNaN(e.target.value) && Number(e.target.value) >= 0) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.reward;
        return newErrors;
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setAlert({
        isOpen: true,
        type: "error",
        message: "Please fill in all required fields correctly",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      formData.append("details", details);
      formData.append("latitude", location.lat);
      formData.append("longitude", location.lon);
      formData.append("reward", reward);

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fileInput.files[0]) {
        formData.append("picture_name", fileInput.files[0]);
      }

      const response = await axiosInstance.post("api/posts/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setAlert({
          isOpen: true,
          type: "success",
          message: "Post created successfully!",
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating report:", error);
      setAlert({
        isOpen: true,
        type: "error",
        message: error.response?.data?.message || "Error creating post",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <AlertModal
        isOpen={alert.isOpen}
        type={alert.type}
        message={alert.message}
        onClose={handleCloseAlert}
      />
      <main className="flex-grow">
        <form onSubmit={handleSubmit}>
          <div className="grid xl:grid-cols-3 gap-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 xl:col-span-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4">
                Report Your Lost
              </h2>
              <p className="text-center text-gray-700 mb-8 max-w-3xl mx-auto">
                Easily report lost items or find something you've misplaced.
                Start by exploring the options below.
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Type of Post</h2>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="default-radio-1"
                        type="radio"
                        value="object"
                        name="postType"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        checked={type === "object"}
                        onChange={handleTypeChange}
                      />
                      <label
                        htmlFor="default-radio-1"
                        className="ms-2 text-sm font-medium"
                      >
                        Dead or Alive: Missing Objects
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="default-radio-2"
                        type="radio"
                        value="living"
                        name="postType"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        checked={type === "living"}
                        onChange={handleTypeChange}
                      />
                      <label
                        htmlFor="default-radio-2"
                        className="ms-2 text-sm font-medium"
                      >
                        Alive: Missing Living things
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Post Title:</h2>
                  <input
                    className={`bg-gray-50 border ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    type="text"
                    onChange={handleTitleChange}
                    placeholder="Title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Add Image:</h2>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 ${
                        errors.image ? "border-red-500" : "border-gray-300"
                      } border-dashed rounded-lg cursor-pointer bg-gray-50`}
                    >
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
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  {errors.image && (
                    <p className="text-red-500 text-sm">{errors.image}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Rewards:</h2>
                  <input
                    className={`bg-gray-50 border ${
                      errors.reward ? "border-red-500" : "border-gray-300"
                    } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    type="number"
                    onChange={handleRewardChange}
                    placeholder="Enter reward amount"
                  />
                  {errors.reward && (
                    <p className="text-red-500 text-sm">{errors.reward}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">📌 Location:</h2>
                  <div className="space-y-3">
                    <div className="overflow-hidden rounded-xl shadow-md border border-gray-200">
                      <MapComponent onLocationChange={setLocation} />
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded-md">
                      ✅ Selected location:{" "}
                      <span className="font-medium">
                        {location.lat.toFixed(6)}, {location.lon.toFixed(6)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Post Details:</h2>
                  <textarea
                    className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border ${
                      errors.details ? "border-red-500" : "border-gray-300"
                    } focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Details"
                    rows="6"
                    onChange={handleDetailsChange}
                  />
                  {errors.details && (
                    <p className="text-red-500 text-sm">{errors.details}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                >
                  {isLoading ? "Creating post..." : "Create Post"}
                </button>
              </div>
            </div>

            <div className="mt-5">
              <h1 className="text-center">(Post Preview)</h1>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-center mt-4">
                  Wanted
                </h1>
                <DisplayType type={type} />
                <hr className="h-0.5 border-t-0 bg-neutral-500" />
                <div className="flex items-center justify-center">
                  {file ? (
                    <img
                      className="max-w-40 max-h-60 object-contain mt-2"
                      src={file}
                      alt="Preview"
                    />
                  ) : // แสดงไอคอนต่างกันตาม type
                  type === "living" ? (
                    <UserCircle className="w-40 h-40 text-gray-400 mt-2" />
                  ) : (
                    <Package className="w-40 h-40 text-gray-400 mt-2" />
                  )}
                </div>
                <h1 className="text-md sm:text-xl lg:text-2xl text-center mb-4">
                  {title}
                </h1>
                <h2 className="text-md sm:text-xl lg:text-2xl text-center mb-4">
                  {reward} $
                </h2>
                <p>{details}</p>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

function DisplayType(type) {
  if (type.type === "living") {
    return (
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-center mb-4">
          <s>Dead</s> or Alive
        </h1>
      </div>
    );
  } else if (type.type === "object") {
    return (
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-center mb-4">
          Dead or Alive
        </h1>
      </div>
    );
  }
}
export default ReportPage;
