import { React, useState, useEffect, useCallback } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import axiosInstance from "../../utils/axios";
import { handleError } from "../../utils/errorHandler";
import { useNavigate } from "react-router-dom";
import { makeCard } from "../card";
import SkeletonCard from "../../components/ui/skeletoncard";

const SearchPage = () => {
  const [error, setError] = useState("");
  const [terms, setTerm] = useState("");
  const navigate = useNavigate();
  const [postsData, setPostData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function search() {
    fetchPost();
  }

  const fetchPost = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("api/search/" + terms);
      setPostData(response.data);
      setError("");
    } catch (err) {
      handleError(err, setError, navigate);
    } finally {
      setIsLoading(false);
    }
  }, [terms, navigate]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  function handleSearchChange(e) {
    setTerm(e.target.value);
  }
  const cards = postsData.map((data) =>
    makeCard(
      data.id,
      data.picture_name,
      data.category,
      data.title,
      data.reward,
      data.status
    )
  );

  function Result() {
    if (isLoading) {
      return (
        <div className="flex flex-wrap justify-center">
          {[...Array(5)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      );
    }

    if (postsData.length > 0) {
      return cards;
    } else {
      return (
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center w-full">
          No Posts Found
        </h3>
      );
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4">
            Search for Wanted posts
          </h2>
          <div className="flex items-center justify-center p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-80 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={handleSearchChange}
              />
              <button
                className="absolute right-2 top-2 text-gray-500"
                onClick={search}
              >
                🔍
              </button>
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          <div className="flex flex-wrap"></div>
          <div className="flex flex-wrap justify-center">
            <Result />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
