'use client';
import React, { useState ,useEffect } from 'react';
import Header from './Header';
import ProfileCard from './ProfileCard';
import EditButton from './EditButton';
import PopUp from './PopUp';
import type { MainLayoutProps } from '@/app/types';

const MainLayout: React.FC<MainLayoutProps> = ({ phone, address }) => {
  const [isPopupActive, setIsPopupActive] = useState<boolean>(false);

  const togglePopup = (): void => {
    setIsPopupActive(!isPopupActive);
  };

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
              <span className="text-sm text-gray-500 font-semibold">Gender:</span>
              <span className="text-base text-gray-900 font-semibold">Male</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Age:</span>
              <span className="text-base text-gray-900 font-semibold">15</span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="text-sm text-gray-500 font-semibold">Blood Group:</span>
              <span className="text-base text-gray-900 font-semibold">B+ve</span>
            </div>
          </div>
          <div className="mb-2 flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">Contact Number:</span>
            <span className="text-base text-gray-900 font-semibold">{phone}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">Address:</span>
            <span className="text-base text-gray-900 font-semibold">{address}</span>
          </div>
        </ProfileCard>

        <ProfileCard title="Parents Information">
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Father/Mother Name:</span>
            <span className="text-base text-gray-900 font-semibold">Mr. Ashok Kumar Jackson</span>
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Contact Number:</span>
            <span className="text-base text-gray-900 font-semibold">+91 9868267234</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">Occupation:</span>
            <span className="text-base text-gray-900 font-semibold">CEO at Fintech Software Private Limited, BBSR</span>
          </div>
        </ProfileCard>

        <ProfileCard title="Academic Information">
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Previous Term Grades:</span>
            <span className="text-base text-gray-900 font-semibold">69% | B+ (Good)</span>
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Best Perform Subject:</span>
            <span className="text-base text-gray-900 font-semibold">Mathematics</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">Weakest Subject:</span>
            <span className="text-base text-gray-900 font-semibold">Physics</span>
          </div>
        </ProfileCard>

        <ProfileCard title="Emergency Contact">
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Father/Mother/Guardian Name:</span>
            <span className="text-base text-gray-900 font-semibold">Mr. Ashok Kumar Jackson</span>
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Contact Number:</span>
            <span className="text-base text-gray-900 font-semibold">+91 9868267234, +91 9868267234</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">Address:</span>
            <span className="text-base text-gray-900 font-semibold">Plot No.81, New Colony, Lane-17, VaniVihar, Bhubaneswar</span>
          </div>
        </ProfileCard>
      </div>
    </div>
  );
};

export default MainLayout;


  // src/app/profile/page.tsx

  
  // export default function ProfilePage() {
  //   const [studentData, setStudentData] = useState<Student | null>(null);
  //   const [isPopupActive, setIsPopupActive] = useState<boolean>(false);
  //   const [isLoading, setIsLoading] = useState<boolean>(true);
  
  //   useEffect(() => {
  //     const fetchProfileData = async () => {
  //       try {
  //         const response = await fetch('/api/profile');
  //         if (!response.ok) throw new Error('Failed to fetch profile');
  //         const data = await response.json();
  //         setStudentData(data);
  //       } catch (error) {
  //         console.error('Error fetching profile:', error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     };
  
  //     fetchProfileData();
  //   }, []);
  
  //   const togglePopup = (): void => {
  //     setIsPopupActive(!isPopupActive);
  //   };
  
  //   if (isLoading) {
  //     return <div>Loading...</div>;
  //   }
  
  //   if (!studentData) {
  //     return <div>Error loading profile data</div>;
  //   }
  
  //   return (
  //     <div className="bg-gradient-to-b from-purple-100 via-orange-50 to-transparent p-8">
  //       <div className={`-z-10 ${isPopupActive ? 'pointer-events-none opacity-50' : ''}`}>
  //         <Header />
  //       </div>
        
  //       <EditButton onClick={togglePopup} />
  //       <PopUp isActive={isPopupActive} onClose={togglePopup} studentData={studentData} />
        
  //       <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2 ${isPopupActive ? 'pointer-events-none opacity-50' : ''}`}>
  //         <ProfileCard title="Personal Information">
  //           <div className="grid grid-cols-2 gap-4 mb-2">
  //             <div className="flex flex-col">
  //               <span className="text-sm text-gray-500 font-semibold">Roll Number:</span>
  //               <span className="text-base text-gray-900 font-semibold">{studentData.rollNo}</span>
  //             </div>
  //             <div className="flex flex-col">
  //               <span className="text-sm text-gray-500 font-semibold">Name:</span>
  //               <span className="text-base text-gray-900 font-semibold">
  //                 {`${studentData.firstName} ${studentData.lastName}`}
  //               </span>
  //             </div>
  //             <div className="flex flex-col">
  //               <span className="text-sm text-gray-500 font-semibold">Date of Birth:</span>
  //               <span className="text-base text-gray-900 font-semibold">
  //                 {new Date(studentData.dob).toLocaleDateString()}
  //               </span>
  //             </div>
  //           </div>
  //           {studentData.address && (
  //             <div className="flex flex-col">
  //               <span className="text-sm text-gray-500 font-semibold">Address:</span>
  //               <span className="text-base text-gray-900 font-semibold">{studentData.address}</span>
  //             </div>
  //           )}
  //         </ProfileCard>
  
  //         <ProfileCard title="Academic Information">
  //           <div className="flex flex-col mb-2">
  //             <span className="text-sm text-gray-500 font-semibold">Class:</span>
  //             <span className="text-base text-gray-900 font-semibold">
  //               {studentData.class?.name || 'Not assigned'}
  //             </span>
  //           </div>
  //           <div className="flex flex-col mb-2">
  //             <span className="text-sm text-gray-500 font-semibold">Class Teacher:</span>
  //             <span className="text-base text-gray-900 font-semibold">
  //               {studentData.class?.class_teacher || 'Not assigned'}
  //             </span>
  //           </div>
  //           <div className="flex flex-col mb-2">
  //             <span className="text-sm text-gray-500 font-semibold">Semester:</span>
  //             <span className="text-base text-gray-900 font-semibold">{studentData.semester}</span>
  //           </div>
  //           <div className="flex flex-col">
  //             <span className="text-sm text-gray-500 font-semibold">Batch:</span>
  //             <span className="text-base text-gray-900 font-semibold">{studentData.batch}</span>
  //           </div>
  //         </ProfileCard>
  
  //         <ProfileCard title="Contact Information">
  //           <div className="flex flex-col mb-2">
  //             <span className="text-sm text-gray-500 font-semibold">Email:</span>
  //             <span className="text-base text-gray-900 font-semibold">{studentData.email}</span>
  //           </div>
  //         </ProfileCard>
  //       </div>
  //     </div>
  //   );
  // }