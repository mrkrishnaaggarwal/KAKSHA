import React from 'react';
import type { EditButtonProps } from '@/app/types';

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-5 py-3 rounded-lg shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-200 font-medium"
        onClick={onClick}
      >
        <svg 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
          />
        </svg>
        Edit Profile
      </button>
    </div>
  );
};

export default EditButton;