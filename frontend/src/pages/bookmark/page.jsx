import { React, useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import axiosInstance from "../../utils/axios";
import { handleError } from "../../utils/errorHandler";
import { useNavigate } from "react-router-dom";
import { makeCard } from "../card";
import SkeletonCard from "../../components/ui/skeletoncard";

const Bookmark = () => {
  const [error, setError] = useState("");
  const [terms, setTerm] = useState("");
  const navigate = useNavigate();
  const [postsData, setPostData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("api/bookmark/");
      setPostData(response.data);
      setError("");
    } catch (err) {
      handleError(err, setError, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

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
        <h3 className="text-lg sm:text-xl font-semibold mb-2">
          No Posts Bookmarked
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
            Bookmarked Posts
          </h2>
          <div className="flex flex-wrap justify-center">
            <Result />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bookmark;
