import React from 'react';
import type { ProfileCardProps } from '@/app/types';

const ProfileCard: React.FC<ProfileCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl group">
      {/* Title with full purple background */}
      <div className="bg-purple-800 text-white font-semibold px-4 py-2 flex items-center justify-between group-hover:bg-purple-900">
        <span>{title}</span>
      </div>
      {/* Card content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default ProfileCard;
