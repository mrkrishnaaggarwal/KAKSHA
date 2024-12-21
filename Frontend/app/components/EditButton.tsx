import React from 'react';
import type { EditButtonProps } from '@/app/types';

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <div className="relative w-full h-10 mt-2">
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-purple-800 text-white rounded px-4 py-2 hover:bg-purple-900"
        onClick={onClick}
      >
        Edit
      </button>
    </div>
  );
};

export default EditButton;