import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface HeaderProps {
  firstName?: string;
  lastName?: string;
  rollNo?: string;
  isProfessor?: boolean;
  
  // Student-specific fields
  className?: string;
  batch?: string;
  semester?: number;
  
  // Professor-specific fields
  department?: string;
  yearsOfService?: number;
}

interface StudentData {
  first_name: string;
  last_name: string;
  roll_no: string;
  class_name?: string;
  batch?: string;
  semester?: number;
}

interface ProfessorData {
  first_name: string;
  last_name: string;
  roll_no: string;
  dept?: string;
  date_of_join?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  firstName = "John", 
  lastName = "Doe", 
  rollNo = "ID000",
  isProfessor = false,
  className,
  batch,
  semester,
  department,
  yearsOfService
}) => {
  const [userData, setUserData] = useState<StudentData | ProfessorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calculatedYearsOfService, setCalculatedYearsOfService] = useState<number | undefined>(yearsOfService);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const endpoint = isProfessor 
          ? 'http://localhost:8080/api/v1/professor/profile'
          : 'http://localhost:8080/api/v1/student/profile';

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          setUserData(response.data.data);
          
          // Calculate years of service for professors if date_of_join is available
          if (isProfessor && response.data.data.date_of_join) {
            const joinDate = new Date(response.data.data.date_of_join);
            const today = new Date();
            let years = today.getFullYear() - joinDate.getFullYear();
            const monthDiff = today.getMonth() - joinDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < joinDate.getDate())) {
              years--;
            }
            setCalculatedYearsOfService(years);
          }
        } else {
          setError('Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error loading user information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isProfessor]);

  // Determine background color based on role
  const bgColor = isProfessor ? "bg-blue-600/30" : "bg-purple-600/30";
  const textInitialsColor = isProfessor ? "text-blue-600" : "text-purple-600";
  const borderColor = isProfessor ? "border-blue-100" : "border-white";

  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden">
      <video 
        src='/giphy.mp4' 
        className="absolute inset-0 w-full h-full object-cover"
        loop
        autoPlay
        muted
      ></video>
        
      <div className={`absolute inset-0 ${bgColor}`} />
      
      <div className="relative z-10 h-full p-8 flex items-center space-x-6">
        <div className={`w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border-4 ${borderColor}`}>
          <span className={`text-2xl font-bold ${textInitialsColor}`}>
            {userData ? 
              `${userData.first_name.charAt(0)}${userData.last_name.charAt(0)}` : 
              `${firstName.charAt(0)}${lastName.charAt(0)}`
            }
          </span>
        </div>
        
        <div className="flex flex-col text-white">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-white/30 rounded mb-2"></div>
              <div className="h-6 w-64 bg-white/30 rounded"></div>
            </div>
          ) : error ? (
            <div className="text-red-200">
              <h1 className="text-4xl font-bold mb-2">{firstName} {lastName}</h1>
              <p className="text-xl">Error loading profile data</p>
            </div>
          ) : userData ? (
            <>
              <h1 className="text-4xl font-bold mb-2">
                {userData.first_name} {userData.last_name}
              </h1>
              {isProfessor ? (
                // Professor information display
                <p className="text-xl text-gray-100">
                  {userData.roll_no} | {(userData as ProfessorData).dept || department || 'Department'} 
                  {calculatedYearsOfService ? ` | ${calculatedYearsOfService} Years of Service` : ''}
                </p>
              ) : (
                // Student information display
                <p className="text-xl text-gray-100">
                  {userData.roll_no} | {(userData as StudentData).class_name || className || 'Class'} 
                  {(userData as StudentData).batch ? ` | Batch ${(userData as StudentData).batch}` : batch ? ` | Batch ${batch}` : ''}
                  {(userData as StudentData).semester ? ` | Semester ${(userData as StudentData).semester}` : semester ? ` | Semester ${semester}` : ''}
                </p>
              )}
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-2">{firstName} {lastName}</h1>
              {isProfessor ? (
                <p className="text-xl text-gray-100">
                  {rollNo} | {department || 'Department'} 
                  {calculatedYearsOfService ? ` | ${calculatedYearsOfService} Years of Service` : ''}
                </p>
              ) : (
                <p className="text-xl text-gray-100">
                  {rollNo} | {className || 'Class'} 
                  {batch ? ` | Batch ${batch}` : ''}
                  {semester ? ` | Semester ${semester}` : ''}
                </p>
              )}
            </>
          )}
        </div>
      </div>  
    </div>
  );
};

export default Header;