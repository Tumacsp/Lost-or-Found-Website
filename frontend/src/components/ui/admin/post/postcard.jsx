import React from "react";
import StatusBadge from "./status";

const PostCard = ({ post, onViewPost, onBanPost, onUnbanPost }) => {
  const isResolved = post.status === "resolved";
  const isInactive = post.status === "inactive";

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 line-clamp-1 hover:line-clamp-none transition-all">
              {post.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{post.user.username}</span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{formatDate(post.created_at)}</span>
              </div>

              <StatusBadge status={post.status} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 min-w-fit">
            <button
              onClick={() => onViewPost(post.id)}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2 rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:ring-2 focus:ring-blue-200 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>View</span>
            </button>

            {isInactive ? (
              <button
                onClick={() => onUnbanPost(post.id)}
                disabled={isResolved}
                className={`w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2 rounded-md
                  ${
                    isResolved
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-green-600 bg-green-50 hover:bg-green-100 focus:ring-2 focus:ring-green-200"
                  }
                  transition-colors`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Unban</span>
              </button>
            ) : (
              <button
                onClick={() => onBanPost(post.id)}
                disabled={isResolved}
                className={`w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2 rounded-md
                  ${
                    isResolved
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-red-600 bg-red-50 hover:bg-red-100 focus:ring-2 focus:ring-red-200"
                  }
                  transition-colors`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
                <span>Ban</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
