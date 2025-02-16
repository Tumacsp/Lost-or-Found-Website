import React from "react";
import StatusBadge from "./status";

const PostCard = ({ post, onViewPost, onBanPost }) => {
  return (
    <div className="hover:bg-gray-50 transition-colors">
      <div className="p-4 sm:p-6">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div className="mb-4 sm:mb-0 sm:mr-4 space-y-2">
            <h2 className="text-lg font-medium text-gray-900 line-clamp-1">
              {post.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span>Posted by: {post.user.username}</span>
              <StatusBadge status={post.status} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onViewPost(post.id)}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              View Details
            </button>
            <button
              onClick={() => onBanPost(post.id)}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Ban Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
