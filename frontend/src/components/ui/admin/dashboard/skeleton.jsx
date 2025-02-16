import React from "react";

const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {/* Heading Skeleton */}
    <div className="h-8 w-48 bg-gray-200 rounded-md mb-6 animate-pulse"></div>

    {/* Cards Skeleton */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="rounded-xl bg-gray-200 p-2 shadow-md animate-pulse"
        >
          <div className="flex p-4">
            <div className="h-5 w-5 rounded-full bg-gray-300"></div>
            <div className="h-4 w-24 bg-gray-300 ml-2 rounded"></div>
          </div>
          <div className="rounded-xl bg-white px-4 py-8">
            <div className="h-8 w-16 bg-gray-200 mx-auto rounded"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Chart Skeleton - Simplified */}
    <div className="w-full rounded-lg border bg-white shadow-sm">
      <div className="p-6">
        <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-64 w-full bg-gray-100 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
