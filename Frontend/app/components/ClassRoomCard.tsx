import React, { useState } from "react";
import { HiOutlineUserGroup, HiOutlineAcademicCap, HiOutlineChevronDown } from "react-icons/hi";

interface ClassroomCardProps {
  id: string;
  subjects: string[];
  isLoadingSubjects?: boolean;
  classCode: string;
  section: string;
  studentsCount?: number;
  coverImage?: string;
  onSubjectSelect: (classId: string, subject: string) => void;
}

const ClassroomCard: React.FC<ClassroomCardProps> = ({
  id,
  subjects,
  isLoadingSubjects = false,
  classCode,
  section,
  studentsCount,
  coverImage,
  onSubjectSelect,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const defaultCoverImages = [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    "https://images.unsplash.com/photo-1489875347897-49f64b51c1f8",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    "https://images.unsplash.com/photo-1598620617148-c9e8a1b2c19f",
  ];

  // Use a deterministic way to select a cover image based on class ID
  const getDefaultCoverImage = () => {
    const idSum = id
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return defaultCoverImages[idSum % defaultCoverImages.length];
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSubjectClick = (subject: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onSubjectSelect(id, subject);
    setIsDropdownOpen(false);
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-200"
    >
      {/* Card Header */}
      <div
        className="h-28 bg-cover bg-center"
        style={{
          backgroundImage: `url(${coverImage || getDefaultCoverImage()})`,
        }}
      >
        <div className="h-full w-full bg-gradient-to-b from-black/50 to-transparent p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-white text-lg truncate">
              {classCode}
            </h3>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-gray-700">
            <HiOutlineAcademicCap className="mr-1.5 text-gray-500" />
            <span className="font-medium">{section}</span>
          </div>
        </div>

        {studentsCount !== undefined && (
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <HiOutlineUserGroup className="mr-1.5" />
            <span>{studentsCount} students</span>
          </div>
        )}

        {/* Subject Selection */}
        <div className="relative mb-2">
          <div 
            className="w-full flex justify-between items-center p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
            onClick={toggleDropdown}
          >
            <span className="text-sm text-gray-700">
              {isLoadingSubjects ? "Loading subjects..." : "Select Subject"}
            </span>
            <HiOutlineChevronDown 
              className={`transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`}
            />
          </div>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
              {subjects.length > 0 ? (
                subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                    onClick={handleSubjectClick(subject)}
                  >
                    {subject}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  {isLoadingSubjects ? "Loading..." : "No subjects available"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Select a subject to view attendance
        </p>
      </div>
    </div>
  );
};

export default ClassroomCard;