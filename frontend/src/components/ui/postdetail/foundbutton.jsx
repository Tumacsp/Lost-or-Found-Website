import React from 'react';

const FoundButton = ({ post, currentUser, handleFound }) => {
  const isInactive = post.status !== "active";
  const isOwnPost = currentUser?.id === post.user.id;
  
  const buttonStyles = {
    base: "w-full py-3 sm:py-4 text-white rounded-lg text-base sm:text-lg font-bold shadow-md",
    disabled: "bg-gray-400 cursor-not-allowed",
    active: "bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
  };

  // If not owner, don't render anything
  if (!isOwnPost) {
    return null;
  }

  if (isInactive) {
    return (
      <div className="pt-4">
        <button
          disabled
          className={`${buttonStyles.base} ${buttonStyles.disabled}`}
        >
          Already Found
        </button>
      </div>
    );
  }

  return (
    <div className="pt-4">
      <button
        onClick={handleFound}
        className={`${buttonStyles.base} ${buttonStyles.active} flex items-center justify-center gap-2 sm:gap-3`}
      >
        Mark as Found
      </button>
    </div>
  );
};

export default FoundButton;