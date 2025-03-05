// 'use client';
// import React, { useState } from 'react';
// import Header from './Header';
// import ProfileCard from './ProfileCard';
// import EditButton from './EditButton';
// import PopUp from './PopUp';

// // Unified interface for both professor and student profile data
// interface MainLayoutProps {
//   // Common personal info
//   firstName: string;
//   lastName: string;
//   rollNo: string;
//   email: string;
//   address?: string;
//   gender?: string;
//   age?: number;
//   dob?: string;
//   bloodGroup?: string;
  
//   // Role indicator
//   isProfessor?: boolean;
  
//   // Student-specific fields
//   className?: string;
//   batch?: string;
//   semester?: number;
//   previousGrades?: string;
//   bestSubject?: string;
//   weakestSubject?: string;
//   parentName?: string;
//   parentContact?: string;
//   parentOccupation?: string;
  
//   // Professor-specific fields
//   department?: string;
//   dateOfJoin?: string;
//   yearsOfService?: number;
//   qualification?: string;
//   specialization?: string;
//   researchInterests?: string;
//   publications?: string;
//   officeHours?: string;
  
//   // Emergency contact (common)
//   emergencyName?: string;
//   emergencyContact?: string;
//   emergencyAddress?: string;
// }

// const MainLayout: React.FC<MainLayoutProps> = ({
//   // Common fields
//   firstName,
//   lastName,
//   rollNo,
//   email,
//   address,
//   gender = "Not specified",
//   age,
//   dob,
//   bloodGroup = "Not specified",
  
//   // Role indicator
//   isProfessor = false,
  
//   // Student-specific fields with defaults
//   className,
//   batch,
//   semester,
//   previousGrades,
//   bestSubject,
//   weakestSubject,
//   parentName,
//   parentContact,
//   parentOccupation,
  
//   // Professor-specific fields with defaults
//   department,
//   dateOfJoin,
//   yearsOfService,
//   qualification,
//   specialization,
//   researchInterests,
//   publications,
//   officeHours,
  
//   // Emergency contact
//   emergencyName,
//   emergencyContact,
//   emergencyAddress,
// }) => {
//   const [isPopupActive, setIsPopupActive] = useState<boolean>(false);

//   const togglePopup = (): void => {
//     setIsPopupActive(!isPopupActive);
//   };

//   // Calculate age from DOB if provided
//   let calculatedAge = age;
//   if (dob) {
//     try {
//       const birthDate = new Date(dob);
//       const today = new Date();
//       calculatedAge = today.getFullYear() - birthDate.getFullYear();
//       const monthDiff = today.getMonth() - birthDate.getMonth();
//       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//         calculatedAge--;
//       }
//     } catch (e) {
//       console.error("Error calculating age:", e);
//     }
//   }

//   // Format date for display
//   const formatDate = (dateString?: string): string => {
//     if (!dateString) return "Not provided";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', { 
//         year: 'numeric', 
//         month: 'long', 
//         day: 'numeric' 
//       });
//     } catch (e) {
//       console.error("Error formatting date:", e);
//       return dateString;
//     }
//   };

//   // Use purple/orange gradient for both roles
//   const gradientStyle = "bg-gradient-to-b from-purple-100 via-orange-50 to-transparent";

//   return (
//     <div className={`${gradientStyle} p-8`}>
//       <div className={`-z-10 ${isPopupActive ? 'pointer-events-none opacity-50' : ''}`}>
//         {/* Pass appropriate props to Header based on user type */}
//         <Header 
//           firstName={firstName}
//           lastName={lastName}
//           rollNo={rollNo}
//           isProfessor={isProfessor}
//           className={className}
//           batch={batch}
//           semester={semester}
//           department={department}
//           yearsOfService={yearsOfService}
//         />
//       </div>
      
//       <EditButton onClick={togglePopup} />
//       <PopUp isActive={isPopupActive} onClose={togglePopup} />
      
//       <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 ${isPopupActive ? 'pointer-events-none opacity-50' : ''}`}>
//         {/* Personal Information Card - Common for both */}
//         <ProfileCard title="Personal Information">
//           <div className="grid grid-cols-2 gap-4 mb-2">
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500 font-semibold">Email:</span>
//               <span className="text-base text-gray-900 font-semibold">{email}</span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500 font-semibold">Gender:</span>
//               <span className="text-base text-gray-900 font-semibold">{gender}</span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500 font-semibold">Age:</span>
//               <span className="text-base text-gray-900 font-semibold">{calculatedAge || "Not provided"}</span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500 font-semibold">Date of Birth:</span>
//               <span className="text-base text-gray-900 font-semibold">{formatDate(dob)}</span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500 font-semibold">Blood Group:</span>
//               <span className="text-base text-gray-900 font-semibold">{bloodGroup}</span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500 font-semibold">Address:</span>
//               <span className="text-base text-gray-900 font-semibold">{address || "Not provided"}</span>
//             </div>
//           </div>
//         </ProfileCard>

//         {/* Second Card - Different for Professor vs Student */}
//         {isProfessor ? (
//           <ProfileCard title="Professional Information">
//             <div className="flex flex-col mb-2">
//               <span className="text-sm text-gray-500 font-semibold">Department:</span>
//               <span className="text-base text-gray-900 font-semibold">{department || "Not assigned"}</span>
//             </div>
//             <div className="flex flex-col mb-2">
//               <span className="text-sm text-gray-500 font-semibold">Date of Joining:</span>
//               <span className="text-base text-gray-900 font-semibold">{formatDate(dateOfJoin)}</span>
//             </div>
//             <div className="flex flex-col mb-2">
//               <span className="text-sm text-gray-500 font-semibold">Years of Service:</span>
//               <span className="text-base text-gray-900 font-semibold">{yearsOfService || "Not calculated"}</span>
//             </div>
//             <div className="flex flex-col mb-2">
//               <span className="text-sm text-gray-500 font-semibold">Qualification:</span>
//               <span className="text-base text-gray-900 font-semibold">{qualification || "PhD in Computer Science"}</span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500 font-semibold">Specialization:</span>
//               <span className="text-base text-gray-900 font-semibold">{specialization || "Computer Science"}</span>
//             </div>
//           </ProfileCard>
//         ) : (
//           <ProfileCard title="Family Information">
//             <div className="flex flex-col mb-2">
//               <span className="text-sm text-gray-500 font-semibold">Parent/Guardian Name:</span>
//               <span className="text-base text-gray-900 font-semibold">{parentName || "Not provided"}</span>
//             </div>
//             <div className="flex flex-col mb-2">
//               <span className="text-sm text-gray-500 font-semibold">Contact Number:</span>
//               <span className="text-base text-gray-900 font-semibold">{parentContact || "Not provided"}</span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500 font-semibold">Occupation:</span>
//               <span className="text-base text-gray-900 font-semibold">{parentOccupation || "Not provided"}</span>
//             </div>
//           </ProfileCard>
//         )}

//         {/* Third Card - Different for Professor vs Student */}
//         {isProfessor ? (
//           <ProfileCard title="Academic Contributions">
//             <div className="flex flex-col mb-2">
//               <span className="text-sm text-gray-500 font-semibold">Research Interests:</span>
//               <span className="text-base text-gray-900 font-semibold">
//                 {researchInterests || "Artificial Intelligence, Machine Learning"}
//               </span>
//             </div>
//             <div className="flex flex-col mb-2">
//               <span className="text-sm text-gray-500 font-semibold">Publications:</span>
//               <span className="text-base text-gray-900 font-semibold">
//                 {publications || "15+ research papers in international journals"}
//               </span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500 font-semibold">Office Hours:</span>
//               <span className="text-base text-gray-900 font-semibold">
//                 {officeHours || "Monday-Thursday: 2PM-4PM"}
//               </span>
//             </div>
//           </ProfileCard>
//         ) : (
//           <ProfileCard title="Academic Information">
//             <div className="flex flex-col mb-2">
//               <span className="text-sm text-gray-500 font-semibold">Class:</span>
//               <span className="text-base text-gray-900 font-semibold">{className || "Not assigned"}</span>
//             </div>
//             <div className="flex flex-col mb-2">
//               <span className="text-sm text-gray-500 font-semibold">Semester:</span>
//               <span className="text-base text-gray-900 font-semibold">{semester || "Not assigned"}</span>
//             </div>
//             <div className="flex flex-col mb-2">
//               <span className="text-sm text-gray-500 font-semibold">Batch:</span>
//               <span className="text-base text-gray-900 font-semibold">{batch || "Not assigned"}</span>
//             </div>
//             <div className="flex flex-col mb-2">
//               <span className="text-sm text-gray-500 font-semibold">Previous Term Grades:</span>
//               <span className="text-base text-gray-900 font-semibold">{previousGrades || "Not available"}</span>
//             </div>
//             <div className="flex flex-col mb-2">
//               <span className="text-sm text-gray-500 font-semibold">Best Performing Subject:</span>
//               <span className="text-base text-gray-900 font-semibold">{bestSubject || "Not available"}</span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500 font-semibold">Subject Needing Improvement:</span>
//               <span className="text-base text-gray-900 font-semibold">{weakestSubject || "Not available"}</span>
//             </div>
//           </ProfileCard>
//         )}

//         {/* Emergency Contact Card - Common for both */}
//         <ProfileCard title="Emergency Contact">
//           <div className="flex flex-col mb-2">
//             <span className="text-sm text-gray-500 font-semibold">Contact Name:</span>
//             <span className="text-base text-gray-900 font-semibold">{emergencyName || "Not provided"}</span>
//           </div>
//           <div className="flex flex-col mb-2">
//             <span className="text-sm text-gray-500 font-semibold">Contact Number:</span>
//             <span className="text-base text-gray-900 font-semibold">{emergencyContact || "Not provided"}</span>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-sm text-gray-500 font-semibold">Address:</span>
//             <span className="text-base text-gray-900 font-semibold">{emergencyAddress || "Not provided"}</span>
//           </div>
//         </ProfileCard>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;
'use client';
import React, { useState } from 'react';
import Header from './Header';
import ProfileCard from './ProfileCard';
import EditButton from './EditButton';
import PopUp from './PopUp';

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
          firstName={firstName}
          lastName={lastName}
          rollNo={rollNo}
          isProfessor={isProfessor}
          className={className}
          batch={batch}
          semester={semester}
          department={department}
          yearsOfService={yearsOfService}
        />
      </div>
      
      <EditButton onClick={togglePopup} />
      <PopUp isActive={isPopupActive} onClose={togglePopup} />
      
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 ${isPopupActive ? 'pointer-events-none opacity-50' : ''}`}>
        {/* Personal Information Card - Common for both */}
        <ProfileCard title="Personal Information">
          <div className="grid grid-cols-2 gap-4 mb-2">
            {/* Email field takes up full width to prevent overflow */}
            <div className="flex flex-col col-span-2">
              <span className="text-sm text-gray-500 font-semibold">Email:</span>
              <span className="text-base text-gray-900 font-semibold break-words">{email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Gender:</span>
              <span className="text-base text-gray-900 font-semibold">{gender}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Age:</span>
              <span className="text-base text-gray-900 font-semibold">{calculatedAge || "Not provided"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Date of Birth:</span>
              <span className="text-base text-gray-900 font-semibold">{formatDate(dob)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Blood Group:</span>
              <span className="text-base text-gray-900 font-semibold">{bloodGroup}</span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="text-sm text-gray-500 font-semibold">Address:</span>
              <span className="text-base text-gray-900 font-semibold break-words">{address || "Not provided"}</span>
            </div>
          </div>
        </ProfileCard>

        {/* Second Card - Different for Professor vs Student */}
        {isProfessor ? (
          <ProfileCard title="Professional Information">
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Department:</span>
              <span className="text-base text-gray-900 font-semibold">{department || "Not assigned"}</span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Date of Joining:</span>
              <span className="text-base text-gray-900 font-semibold">{formatDate(dateOfJoin)}</span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Years of Service:</span>
              <span className="text-base text-gray-900 font-semibold">{yearsOfService || "Not calculated"}</span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Qualification:</span>
              <span className="text-base text-gray-900 font-semibold break-words">{qualification || "PhD in Computer Science"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Specialization:</span>
              <span className="text-base text-gray-900 font-semibold break-words">{specialization || "Computer Science"}</span>
            </div>
          </ProfileCard>
        ) : (
          <ProfileCard title="Family Information">
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Parent/Guardian Name:</span>
              <span className="text-base text-gray-900 font-semibold break-words">{parentName || "Not provided"}</span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Contact Number:</span>
              <span className="text-base text-gray-900 font-semibold">{parentContact || "Not provided"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Occupation:</span>
              <span className="text-base text-gray-900 font-semibold break-words">{parentOccupation || "Not provided"}</span>
            </div>
          </ProfileCard>
        )}

        {/* Third Card - Different for Professor vs Student */}
        {isProfessor ? (
          <ProfileCard title="Academic Contributions">
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Research Interests:</span>
              <span className="text-base text-gray-900 font-semibold break-words">
                {researchInterests || "Artificial Intelligence, Machine Learning"}
              </span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Publications:</span>
              <span className="text-base text-gray-900 font-semibold break-words">
                {publications || "15+ research papers in international journals"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Office Hours:</span>
              <span className="text-base text-gray-900 font-semibold">
                {officeHours || "Monday-Thursday: 2PM-4PM"}
              </span>
            </div>
          </ProfileCard>
        ) : (
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
              <span className="text-base text-gray-900 font-semibold">{previousGrades || "Not available"}</span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 font-semibold">Best Performing Subject:</span>
              <span className="text-base text-gray-900 font-semibold">{bestSubject || "Not available"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-semibold">Subject Needing Improvement:</span>
              <span className="text-base text-gray-900 font-semibold">{weakestSubject || "Not available"}</span>
            </div>
          </ProfileCard>
        )}

        {/* Emergency Contact Card - Common for both */}
        <ProfileCard title="Emergency Contact">
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Contact Name:</span>
            <span className="text-base text-gray-900 font-semibold break-words">{emergencyName || "Not provided"}</span>
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-sm text-gray-500 font-semibold">Contact Number:</span>
            <span className="text-base text-gray-900 font-semibold">{emergencyContact || "Not provided"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">Address:</span>
            <span className="text-base text-gray-900 font-semibold break-words">{emergencyAddress || "Not provided"}</span>
          </div>
        </ProfileCard>
      </div>
    </div>
  );
};

export default MainLayout;