import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchDashboardPosts,
  banPost,
  unbanPost,
} from "../../utils/apiservice";
import AlertModal from "../../components/ui/alert";
import PostCard from "../../components/ui/admin/post/postcard";
import PaginationControls from "../../components/ui/admin/pagecontrol";

const POSTS_PER_PAGE = 5;

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (alert.type === "success" && alert.isOpen) {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, isOpen: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const loadPosts = async () => {
    try {
      const data = await fetchDashboardPosts();
      setPosts(data);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleBanPost = async (postId) => {
    try {
      const response = await banPost(postId);
      setAlert({
        isOpen: true,
        type: "success",
        message: response.message || "Post has been banned successfully",
      });
      await loadPosts();
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to Ban user";
      setAlert({
        isOpen: true,
        type: "error",
        message: errorMessage,
      });
    }
  };

  const handleUnbanPost = async (postId) => {
    try {
      const response = await unbanPost(postId);
      setAlert({
        isOpen: true,
        type: "success",
        message: response.message || "Post has been unbanned successfully",
      });
      await loadPosts();
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to UnBan post";
      setAlert({
        isOpen: true,
        type: "error",
        message: errorMessage,
      });
    }
  };

  const handleViewPost = (postId) => {
    navigate(`/postdetail/${postId}`);
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

    if (error) {
      return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex h-96 items-center justify-center">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        </div>
      );
    }

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="md:flex md:items-center md:justify-between">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">
          Posts Management
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {paginatedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onViewPost={handleViewPost}
              onBanPost={handleBanPost}
              onUnbanPost={handleUnbanPost}
            />
          ))}
        </div>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <AlertModal
        isOpen={alert.isOpen}
        type={alert.type}
        message={alert.message}
        onClose={handleCloseAlert}
      />
    </div>
  );
};

export default PostsPage;
