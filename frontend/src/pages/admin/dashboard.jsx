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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!dashboardData) return <div>No data available</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Dashboard</h1>
      <CardWrapper data={dashboardData} />
      <PostStatsGraph data={dashboardData} />
    </div>
  );
};

export default DashboardPage;
