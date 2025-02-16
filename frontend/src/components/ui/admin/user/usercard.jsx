import React from "react";
import { UserCircle2 } from "lucide-react";

const UserCard = ({ user, onBanUser }) => {
  return (
    <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
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
          <p className="truncate font-medium text-gray-900">{user.username}</p>
          <p className="truncate text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <button
        onClick={() => onBanUser(user.id)}
        className="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Ban User
      </button>
    </div>
  );
};

export default UserCard;
