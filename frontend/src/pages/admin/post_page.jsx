import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDashboardPosts, banPost } from "../../utils/apiservice";

const statusStyles = {
  active: {
    bg: "bg-green-100",
    text: "text-green-700",
    label: "Active"
  },
  inactive: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: "Inactive"
  },
  resolved: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "Resolved"
  }
};

const StatusBadge = ({ status }) => {
  const style = statusStyles[status] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: status
  };

  return (
    <span className={`${style.bg} ${style.text} px-2 py-1 rounded-full text-xs font-medium inline-block`}>
      {style.label}
    </span>
  );
};

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

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
      await banPost(postId);
      await loadPosts();
    } catch (err) {
      setError("Failed to ban post");
    }
  };

  const handleViewPost = (postId) => {
    navigate(`/postdetail/${postId}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
      Error: {error}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="md:flex md:items-center md:justify-between">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">Posts</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {posts.map((post) => (
            <div key={post.id} className="hover:bg-gray-50 transition-colors">
              <div className="p-4 sm:p-6">
                <div className="sm:flex sm:items-start sm:justify-between">
                  {/* Left side - Post info */}
                  <div className="mb-4 sm:mb-0 sm:mr-4 space-y-2">
                    <h2 className="text-lg font-medium text-gray-900 line-clamp-1">
                      {post.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span>Posted by: {post.user.username}</span>
                      <StatusBadge status={post.status} />
                    </div>
                  </div>

                  {/* Right side - Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleViewPost(post.id)}
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleBanPost(post.id)}
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      Ban Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
