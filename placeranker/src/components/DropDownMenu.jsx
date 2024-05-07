import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleEditProfileClick = () => {
    navigate('/editprofile');
    setIsOpen(false); // Close the dropdown menu after clicking the "Edit Profile" button
  };
  const handleHomePageClick = () => {
    navigate('/');
    setIsOpen(false); // Close the dropdown menu after clicking the "Edit Profile" button
  };
  const handleReviewClick = () => {
    navigate('/review');
    setIsOpen(false); // Close the dropdown menu after clicking the "Edit Profile" button
  };
  const handleFriendsClick = () => {
    navigate('/friends');
    setIsOpen(false); // Close the dropdown menu after clicking the "Edit Profile" button
  };

  const handleSignOut = () => {
    window.localStorage.removeItem("login_token")
    window.location.assign("/login");
  }

  return (
    <div className="relative">
      <button
        className="flex items-center text-gray-700 hover:text-gray-900"
        onClick={toggleDropdown}
      >
        <svg
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Menu
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <button
            onClick={handleEditProfileClick}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
          >
            Edit Profile
          </button>
          <button
            onClick={handleHomePageClick}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
          >
            Home Page
          </button>
          <button
            onClick={handleReviewClick}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
          >
            Leave a Review
          </button>
          <button
            onClick={handleFriendsClick}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
          >
            Friends
          </button>
          <button
            onClick={handleSignOut}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;