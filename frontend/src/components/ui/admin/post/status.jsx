import React from "react";

const statusStyles = {
  active: {
    bg: "bg-green-100",
    text: "text-green-700",
    label: "Active",
  },
  inactive: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: "Inactive",
  },
  resolved: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "Resolved",
  },
};

const StatusBadge = ({ status }) => {
  const style = statusStyles[status] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: status,
  };

  return (
    <span
      className={`${style.bg} ${style.text} px-2 py-1 rounded-full text-xs font-medium inline-block`}
    >
      {style.label}
    </span>
  );
};

export default StatusBadge;
