// SkeletonCard.jsx
import React from "react";

const SkeletonCard = () => {
  return (
    <div className="m-2 w-64 animate-pulse p-3">
      <div className="bg-amber-200 h-12 rounded-t-md flex items-center justify-center">
        <div className="bg-gray-300 w-28 h-4 mx-auto"></div>
      </div>

      <div className="bg-white p-4 rounded-b-md border border-amber-300">
        <div className="bg-gray-300 h-40 w-full mb-4"></div>

        <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>

        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
