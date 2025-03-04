import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface HeaderProps {
  firstName?: string;
  lastName?: string;
  rollNo?: string;
  className?: string;
  batch?: string;
  semester?: number;
}

interface UserData {
  first_name: string;
  last_name: string;
  roll_no: string;
  class_name: string;
  batch: string;
  semester: number;
}

const Header: React.FC<HeaderProps> = ({ 
  firstName = "John", 
  lastName = "Doe", 
  rollNo = "STU000", 
  className = "Computer Science",
  batch = "2023",
  semester
}) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await axios.get('http://localhost:8080/api/v1/student/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          setUserData(response.data.data);
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
  }, []);

  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden">
      <video 
        src='/giphy.mp4' 
        className="absolute inset-0 w-full h-full object-cover"
        loop
        autoPlay
        muted
      ></video>
        
      <div className="absolute inset-0 bg-purple-600/30" />
      
      <div className="relative z-10 h-full p-8 flex items-center space-x-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white">
          <span className="text-2xl font-bold text-purple-600">
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
              <p className="text-xl text-gray-100">
                {userData.roll_no} | {userData.class_name} 
                {userData.batch ? ` | Batch ${userData.batch}` : ''}
                {userData.semester ? ` | Semester ${userData.semester}` : ''}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-2">{firstName} {lastName}</h1>
              <p className="text-xl text-gray-100">
                {rollNo} | {className} 
                {batch ? ` | Batch ${batch}` : ''}
                {semester ? ` | Semester ${semester}` : ''}
              </p>
            </>
          )}
        </div>
      </div>  
    </div>
  );
};

export default Header;