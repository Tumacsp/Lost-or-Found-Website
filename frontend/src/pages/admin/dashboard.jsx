import React, { useState, useEffect } from "react";
import { CardWrapper } from "../../components/ui/admin/dashboard/card";
import PostStatsGraph from "../../components/ui/admin/dashboard/post-chart";
import { fetchDashboardData } from "../../utils/apiservice";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

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

  if (!dashboardData) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex h-96 items-center justify-center">
          <p className="text-lg text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <CardWrapper data={dashboardData} />
      <PostStatsGraph data={dashboardData} />
    </div>
  );
};

export default DashboardPage;
