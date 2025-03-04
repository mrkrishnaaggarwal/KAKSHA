'use client';
import React, { useState } from 'react';
import Header from './Header';
import ProfileCard from './ProfileCard';
import EditButton from './EditButton';
import PopUp from './PopUp';
import type { MainLayoutProps } from '@/app/types';

// Extended interface for the MainLayout props with all potential fields
interface ExtendedMainLayoutProps {
  // Personal Info
  firstName: string;
  lastName: string;
  rollNo: string;
  email: string;
  address?: string;
  gender?: string;
  age?: number;
  dob?: string;
  bloodGroup?: string;
  
  // Academic Info
  className?: string;
  batch?: string;
  semester?: number;
  previousGrades?: string;
  bestSubject?: string;
  weakestSubject?: string;
  
  // Parent Info
  parentName?: string;
  parentContact?: string;
  parentOccupation?: string;
  
  // Emergency Contact
  emergencyName?: string;
  emergencyContact?: string;
  emergencyAddress?: string;
}

const MainLayout: React.FC<ExtendedMainLayoutProps> = ({
  firstName,
  lastName,
  rollNo,
  email,
  address,
  gender = "Male", // Default values for fields that might not be in API
  age = 20,
  dob,
  bloodGroup = "B+ve",
  className,
  batch,
  semester,
  previousGrades = "69% | B+ (Good)",
  bestSubject = "Mathematics",
  weakestSubject = "Physics",
  parentName = "Mr. Ashok Kumar Jackson",
  parentContact = "+91 9868267234",
  parentOccupation = "CEO at Fintech Software Private Limited, BBSR",
  emergencyName = "Mr. Ashok Kumar Jackson",
  emergencyContact = "+91 9868267234, +91 9868267234",
  emergencyAddress = "Plot No.81, New Colony, Lane-17, VaniVihar, Bhubaneswar"
}) => {
  const [isPopupActive, setIsPopupActive] = useState<boolean>(false);

  const togglePopup = (): void => {
    setIsPopupActive(!isPopupActive);
  };

  // Calculate age from DOB if provided
  let calculatedAge = age;
  if (dob) {
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
    } catch (e) {
      console.error("Error calculating age:", e);
    }
  }

  return (
    <div className="bg-gradient-to-b from-purple-100 via-orange-50 to-transparent p-8">
      <div className={`-z-10 ${isPopupActive ? 'pointer-events-none opacity-50' : ''}`}>
        <Header />
      </div>
      
      <EditButton onClick={togglePopup} />
      <PopUp isActive={isPopupActive} onClose={togglePopup} />
      
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2 ${isPopupActive ? 'pointer-events-none opacity-50' : ''}`}>
        <ProfileCard title="Personal Information">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Full Name:</span>
              <span className="text-base text-gray-900 font-semibold">{`${firstName} ${lastName}`}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Roll No:</span>
              <span className="text-base text-gray-900 font-semibold">{rollNo}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Gender:</span>
              <span className="text-base text-gray-900 font-semibold">{gender}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Age:</span>
              <span className="text-base text-gray-900 font-semibold">{calculatedAge}</span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="text-sm text-gray-500 font-semibold">Blood Group:</span>
              <span className="text-base text-gray-900 font-semibold">{bloodGroup}</span>
            </div>
          </div>
          <div className="mb-2 flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">Email:</span>
            <span className="text-base text-gray-900 font-semibold">{email}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">Address:</span>
            <span className="text-base text-gray-900 font-semibold">{address || "Not provided"}</span>
          </div>
        </ProfileCard>

        <ProfileCard title="Parents Information">
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Father/Mother Name:</span>
            <span className="text-base text-gray-900 font-semibold">{parentName}</span>
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Contact Number:</span>
            <span className="text-base text-gray-900 font-semibold">{parentContact}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">Occupation:</span>
            <span className="text-base text-gray-900 font-semibold">{parentOccupation}</span>
          </div>
        </ProfileCard>

        <ProfileCard title="Academic Information">
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Class:</span>
            <span className="text-base text-gray-900 font-semibold">{className || "Not assigned"}</span>
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Semester:</span>
            <span className="text-base text-gray-900 font-semibold">{semester || "Not assigned"}</span>
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Batch:</span>
            <span className="text-base text-gray-900 font-semibold">{batch || "Not assigned"}</span>
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Previous Term Grades:</span>
            <span className="text-base text-gray-900 font-semibold">{previousGrades}</span>
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Best Perform Subject:</span>
            <span className="text-base text-gray-900 font-semibold">{bestSubject}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">Weakest Subject:</span>
            <span className="text-base text-gray-900 font-semibold">{weakestSubject}</span>
          </div>
        </ProfileCard>

        <ProfileCard title="Emergency Contact">
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Father/Mother/Guardian Name:</span>
            <span className="text-base text-gray-900 font-semibold">{emergencyName}</span>
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Contact Number:</span>
            <span className="text-base text-gray-900 font-semibold">{emergencyContact}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">Address:</span>
            <span className="text-base text-gray-900 font-semibold">{emergencyAddress}</span>
          </div>
        </ProfileCard>
      </div>
    </div>
  );
};

export default MainLayout;