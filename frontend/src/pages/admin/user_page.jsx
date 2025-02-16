import React, { useState, useEffect } from "react";
import { fetchDashboardUsers, banUser } from "../../utils/apiservice";
import { UserCircle2 } from "lucide-react";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchDashboardUsers();
      console.log("Users data:", data);
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await banUser(userId);
      // Reload users after successful ban
      await loadUsers();
    } catch (err) {
      setError("Failed to ban user");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Users</h1>
      <div className="rounded-lg bg-white shadow">
        <div className="divide-y divide-gray-200">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
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
                  <p className="truncate font-medium text-gray-900">
                    {user.username}
                  </p>
                  <p className="truncate text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleBanUser(user.id)}
                className="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Ban User
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
