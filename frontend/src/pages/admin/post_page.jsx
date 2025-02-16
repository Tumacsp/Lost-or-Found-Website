import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDashboardPosts, banPost } from "../../utils/apiservice";
import PostCard from '../../components/ui/admin/dashboard/post/postcard';
import PaginationControls from '../../components/ui/admin/dashboard/pagecontrol';

const POSTS_PER_PAGE = 5;

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="md:flex md:items-center md:justify-between">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">Posts Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {paginatedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onViewPost={handleViewPost}
              onBanPost={handleBanPost}
            />
          ))}
        </div>
      </div>
      
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PostsPage;
