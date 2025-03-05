import React from 'react';

interface ProfileCardProps {
  title: string;
  children: React.ReactNode;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

export default ProfileCard;