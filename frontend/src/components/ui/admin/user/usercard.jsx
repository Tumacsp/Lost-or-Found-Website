import React from "react";
import { UserCircle2 } from "lucide-react";

const UserCard = ({ user, onBanUser, onUnbanUser }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="shrink-0">
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.username}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <UserCircle2 className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold text-gray-900">
                  {user.username}
                </p>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                    ${
                      user.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                >
                  {user.is_active ? "Active" : "Banned"}
                </span>
              </div>
              <p className="truncate text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 min-w-fit">
            {user.is_active ? (
              <button
                onClick={() => onBanUser(user.id)}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2 rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:ring-2 focus:ring-red-200 transition-colors"
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
                <span>Ban User</span>
              </button>
            ) : (
              <button
                onClick={() => onUnbanUser(user.id)}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2 rounded-md text-green-600 bg-green-50 hover:bg-green-100 focus:ring-2 focus:ring-green-200 transition-colors"
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
                <span>Unban User</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
