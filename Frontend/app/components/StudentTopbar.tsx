'use client';

import React from 'react';
import Image from 'next/image';

interface TopbarProps {
  name: string;
  profilePic: string;
  details?: { label: string; value: string }[]; // Optional additional details
}

const Topbar: React.FC<TopbarProps> = ({ name, profilePic, details }) => {
  return (
    <div className="w-full bg-gray-100 py-4 px-6 flex justify-between items-center shadow-md">
      {/* Left Section - Welcome Message */}
      <div className="text-lg font-semibold">
        <span>Welcome, </span>
        <span className="text-blue-600">{name}</span>!
      </div>

      {/* Right Section - Profile Pic and Details */}
      <div className="flex items-center space-x-4">
        {/* Additional Details */}
        {details &&
          details.map((detail, index) => (
            <div key={index} className="text-sm text-gray-600">
              <span className="font-semibold">{detail.label}:</span> {detail.value}
            </div>
          ))}

        {/* Profile Picture */}
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={profilePic}
            alt={`${name}'s profile picture`}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
