import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <span className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium ${getStatusStyles()}`}>
      {status === "resolved" ? "Founded" : status === "active" ? "Searching" : "Closed"}
    </span>
  );
};

export default StatusBadge;
