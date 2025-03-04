"use client";

import { useState } from 'react';
import Image from 'next/image';
import { HiOutlineDotsVertical, HiOutlineUsers, HiOutlineFolder } from 'react-icons/hi';

type ClassroomCardProps = {
  id: string;
  subject: string;
  classCode: string;
  section: string;
  studentsCount: number;
  coverImage?: string;
  onCardClick: (classId: string) => void;
};

const bannerColors = [
  'bg-blue-600',
  'bg-green-600',
  'bg-purple-600',
  'bg-pink-600',
  'bg-yellow-600',
  'bg-red-600',
  'bg-indigo-600',
  'bg-teal-600'
];

export default function ClassroomCard({
  id,
  subject,
  classCode,
  section,
  studentsCount,
  coverImage,
  onCardClick
}: ClassroomCardProps) {
  // Get a random but consistent color based on subject name
  const getColorIndex = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % bannerColors.length;
  };

  const bannerColor = bannerColors[getColorIndex(subject)];
  
  return (
    <div 
      className="rounded-lg shadow-sm overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer flex flex-col h-[280px]"
      onClick={() => onCardClick(id)}
    >
      {/* Card banner/header */}
      {coverImage ? (
        <div className="h-32 relative">
          <Image 
            src={coverImage}
            alt={subject}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className={`h-32 ${bannerColor}`}></div>
      )}
      
      {/* Card content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-medium text-gray-800 mb-1 truncate">{subject}</h3>
          <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
            <HiOutlineDotsVertical size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-1">{section}</p>
        <p className="text-sm text-gray-500 mb-4">Code: {classCode}</p>
        
        <div className="mt-auto flex justify-between items-center">
          <div className="flex items-center text-gray-600">
            <HiOutlineUsers className="mr-1.5" />
            <span className="text-sm">{studentsCount} students</span>
          </div>
          <div className="flex items-center text-gray-600">
            <HiOutlineFolder className="mr-1.5" />
            <span className="text-sm">Materials</span>
          </div>
        </div>
      </div>
    </div>
  );
}