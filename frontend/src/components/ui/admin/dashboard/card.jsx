import React from 'react';
import { Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const iconMap = {
  users: Users,
  totalPosts: FileText,
  activePosts: AlertCircle,
  resolvedPosts: CheckCircle
};

const Card = ({ title, value, type }) => {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-200 p-2 shadow-md">
      <div className="flex p-4">
        {Icon && <Icon className="h-5 w-5 text-gray-700" />}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl">
        {value}
      </p>
    </div>
  );
};

const CardWrapper = ({ data }) => {
  
  if (!data || !data.overview) {
    return <div>No data available</div>;
  }

  const {
    totalUsers,
    activePosts,
    resolvedPosts,
    totalPosts,
  } = data.overview;

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card title="Total Users" value={totalUsers} type="users" />
      <Card title="Total Posts" value={totalPosts} type="totalPosts" />
      <Card title="Active Posts" value={activePosts} type="activePosts" />
      <Card title="Resolved Posts" value={resolvedPosts} type="resolvedPosts" />
    </div>
  );
};

export { Card, CardWrapper };
