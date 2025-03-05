'use client';
import React, { useState } from 'react';
import Header from './Header';
import ProfileCard from './ProfileCard';
import EditButton from './EditButton';
import ProfileEditPopup from './ProfileEditPopup';
import axios from 'axios';

// Unified interface for both professor and student profile data
interface MainLayoutProps {
  // Common personal info
  firstName: string;
  lastName: string;
  rollNo: string;
  email: string;
  address?: string;
  gender?: string;
  age?: number;
  dob?: string;
  bloodGroup?: string;
  
  // Role indicator
  isProfessor?: boolean;
  
  // Student-specific fields
  className?: string;
  batch?: string;
  semester?: number;
  previousGrades?: string;
  bestSubject?: string;
  weakestSubject?: string;
  parentName?: string;
  parentContact?: string;
  parentOccupation?: string;
  
  // Professor-specific fields
  department?: string;
  dateOfJoin?: string;
  yearsOfService?: number;
  qualification?: string;
  specialization?: string;
  researchInterests?: string;
  publications?: string;
  officeHours?: string;
  
  // Emergency contact (common)
  emergencyName?: string;
  emergencyContact?: string;
  emergencyAddress?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  // Common fields
  firstName,
  lastName,
  rollNo,
  email,
  address,
  gender = "Not specified",
  age,
  dob,
  bloodGroup = "Not specified",
  
  // Role indicator
  isProfessor = false,
  
  // Student-specific fields with defaults
  className,
  batch,
  semester,
  previousGrades,
  bestSubject,
  weakestSubject,
  parentName,
  parentContact,
  parentOccupation,
  
  // Professor-specific fields with defaults
  department,
  dateOfJoin,
  yearsOfService,
  qualification,
  specialization,
  researchInterests,
  publications,
  officeHours,
  
  // Emergency contact
  emergencyName,
  emergencyContact,
  emergencyAddress,
}) => {
  const [isPopupActive, setIsPopupActive] = useState<boolean>(false);
  const [userData, setUserData] = useState({
    firstName,
    lastName,
    rollNo,
    email,
    address,
    gender,
    age,
    dob,
    bloodGroup,
    isProfessor,
    className,
    batch,
    semester,
    previousGrades,
    bestSubject,
    weakestSubject,
    parentName,
    parentContact,
    parentOccupation,
    department,
    dateOfJoin,
    yearsOfService,
    qualification,
    specialization,
    researchInterests,
    publications,
    officeHours,
    emergencyName,
    emergencyContact,
    emergencyAddress,
  });

  const togglePopup = (): void => {
    setIsPopupActive(!isPopupActive);
  };

  const handleProfileUpdate = async (formData: any): Promise<void> => {
    try {
      // Determine the API endpoint based on the user role
      const endpoint = isProfessor ? 'http://localhost:8080/api/v1/professor/profile' : 'http://localhost:8080/api/v1/student/profile';
      const token = localStorage.getItem("token");
      // Make API call to update the profile
      // console.log(formData);
      const response = await axios.put(endpoint, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Include authentication cookies
      });
      
      if (response.status === 200 && response.data.success) {
        // Update local state with the new data
        setUserData(prevData => ({
          ...prevData,
          ...formData
        }));
        
        // Close the popup after successful update
        setIsPopupActive(false);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Calculate age from DOB if provided
  let calculatedAge = userData.age;
  if (userData.dob) {
    try {
      const birthDate = new Date(userData.dob);
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

  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Not provided";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  // Use purple/orange gradient for both roles
  const gradientStyle = "bg-gradient-to-b from-purple-100 via-orange-50 to-transparent";

  return (
    <div className={`${gradientStyle} p-8`}>
      <div className={`-z-10 ${isPopupActive ? 'pointer-events-none opacity-50' : ''}`}>
        {/* Pass appropriate props to Header based on user type */}
        <Header 
          firstName={userData.firstName}
          lastName={userData.lastName}
          rollNo={userData.rollNo}
          isProfessor={userData.isProfessor}
          className={userData.className}
          batch={userData.batch}
          semester={userData.semester}
          department={userData.department}
          yearsOfService={userData.yearsOfService}
        />
      </div>
      
      <EditButton onClick={togglePopup} />
      
      {/* Profile Edit Popup */}
      <ProfileEditPopup 
        isActive={isPopupActive}
        onClose={togglePopup}
        onSubmit={handleProfileUpdate}
        userData={userData}
      />
      
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 ${isPopupActive ? 'pointer-events-none opacity-50' : ''}`}>
        {/* Personal Information Card - Common for both */}
        <ProfileCard title="Personal Information">
          <div className="grid grid-cols-2 gap-4 mb-2">
            {/* Email field takes up full width to prevent overflow */}
            <div className="flex flex-col col-span-2">
              <span className="text-sm text-gray-500 font-semibold">Email:</span>
              <span className="text-base text-gray-900 font-semibold break-words">{userData.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Gender:</span>
              <span className="text-base text-gray-900 font-semibold">{userData.gender}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Age:</span>
              <span className="text-base text-gray-900 font-semibold">{calculatedAge || "Not provided"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Date of Birth:</span>
              <span className="text-base text-gray-900 font-semibold">{formatDate(userData.dob)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Blood Group:</span>
              <span className="text-base text-gray-900 font-semibold">{userData.bloodGroup}</span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="text-sm text-gray-500 font-semibold">Address:</span>
              <span className="text-base text-gray-900 font-semibold break-words">{userData.address || "Not provided"}</span>
            </div>
          </div>
        </ProfileCard>

        {/* Second Card - Different for Professor vs Student */}
        {userData.isProfessor ? (
          <ProfileCard title="Professional Information">
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Department:</span>
              <span className="text-base text-gray-900 font-semibold">{userData.department || "Not assigned"}</span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Date of Joining:</span>
              <span className="text-base text-gray-900 font-semibold">{formatDate(userData.dateOfJoin)}</span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Years of Service:</span>
              <span className="text-base text-gray-900 font-semibold">{userData.yearsOfService || "Not calculated"}</span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Qualification:</span>
              <span className="text-base text-gray-900 font-semibold break-words">{userData.qualification || "PhD in Computer Science"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Specialization:</span>
              <span className="text-base text-gray-900 font-semibold break-words">{userData.specialization || "Computer Science"}</span>
            </div>
          </ProfileCard>
        ) : (
          <ProfileCard title="Family Information">
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Parent/Guardian Name:</span>
              <span className="text-base text-gray-900 font-semibold break-words">{userData.parentName || "Not provided"}</span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Contact Number:</span>
              <span className="text-base text-gray-900 font-semibold">{userData.parentContact || "Not provided"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Occupation:</span>
              <span className="text-base text-gray-900 font-semibold break-words">{userData.parentOccupation || "Not provided"}</span>
            </div>
          </ProfileCard>
        )}

        {/* Third Card - Different for Professor vs Student */}
        {userData.isProfessor ? (
          <ProfileCard title="Academic Contributions">
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Research Interests:</span>
              <span className="text-base text-gray-900 font-semibold break-words">
                {userData.researchInterests || "Artificial Intelligence, Machine Learning"}
              </span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Publications:</span>
              <span className="text-base text-gray-900 font-semibold break-words">
                {userData.publications || "15+ research papers in international journals"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Office Hours:</span>
              <span className="text-base text-gray-900 font-semibold">
                {userData.officeHours || "Monday-Thursday: 2PM-4PM"}
              </span>
            </div>
          </ProfileCard>
        ) : (
          <ProfileCard title="Academic Information">
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Class:</span>
              <span className="text-base text-gray-900 font-semibold">{userData.className || "Not assigned"}</span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Semester:</span>
              <span className="text-base text-gray-900 font-semibold">{userData.semester || "Not assigned"}</span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Batch:</span>
              <span className="text-base text-gray-900 font-semibold">{userData.batch || "Not assigned"}</span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Previous Term Grades:</span>
              <span className="text-base text-gray-900 font-semibold">{userData.previousGrades || "Not available"}</span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Best Performing Subject:</span>
              <span className="text-base text-gray-900 font-semibold">{userData.bestSubject || "Not available"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Subject Needing Improvement:</span>
              <span className="text-base text-gray-900 font-semibold">{userData.weakestSubject || "Not available"}</span>
            </div>
          </ProfileCard>
        )}

        {/* Emergency Contact Card - Common for both */}
        <ProfileCard title="Emergency Contact">
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Contact Name:</span>
            <span className="text-base text-gray-900 font-semibold break-words">{userData.emergencyName || "Not provided"}</span>
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Contact Number:</span>
            <span className="text-base text-gray-900 font-semibold">{userData.emergencyContact || "Not provided"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">Address:</span>
            <span className="text-base text-gray-900 font-semibold break-words">{userData.emergencyAddress || "Not provided"}</span>
          </div>
        </ProfileCard>
      </div>
    </div>
  );
};

export default MainLayout;