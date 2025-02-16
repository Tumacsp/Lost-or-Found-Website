import React, { useState, useEffect } from "react";
import { fetchDashboardUsers, banUser } from "../../utils/apiservice";
import UserCard from "../../components/ui/admin/user/usercard";
import StatsCard from "../../components/ui/admin/user/userstats_card";
import PaginationControls from "../../components/ui/admin/pagecontrol";

const USERS_PER_PAGE = 5;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = await fetchDashboardUsers();
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
      await loadUsers();
    } catch (err) {
      setError("Failed to ban user");
    }
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

  if (error)
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error: {error}
      </div>
    );

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, startIndex + USERS_PER_PAGE);

  const statsData = [
    {
      title: "Total Users",
      value: users.length,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Active Users",
      value: users.filter((user) => user.is_active).length,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Inactive Users",
      value: users.filter((user) => !user.is_active).length,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl mb-4">
          Users Management
        </h1>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              bgColor={stat.bgColor}
              textColor={stat.textColor}
            />
          ))}
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="flex items-center justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-red-600">Error: {error}</div>
          ) : (
            <>
              {users
                .slice(
                  (currentPage - 1) * USERS_PER_PAGE,
                  currentPage * USERS_PER_PAGE
                )
                .map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onBanUser={handleBanUser}
                  />
                ))}
            </>
          )}
        </div>
      </div>

      {users.length > USERS_PER_PAGE && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default UsersPage;
