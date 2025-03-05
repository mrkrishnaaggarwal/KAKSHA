"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface StudentData {
  first_name: string;
  last_name: string;
}

function GreetingCard({ name }: { name: string }) {
  const [studentName, setStudentName] = useState<string>(name);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:8080/api/v1/student/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        if (response.data.success) {
          const { first_name, last_name } = response.data.data;
          setStudentName(`${first_name} ${last_name}`);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="relative rounded-xl max-h-fit ml-2 p-2 overflow-hidden">
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-0">
        <source src='/giphy.mp4' type="video/mp4" />
      </video>
      <div className="relative z-10 text-white p-2">
        <h2 className="text-2xl font-bold">WELCOME BACK</h2>
        <h1 className="text-2xl mt-1 font-semibold text-white-950">
          {isLoading ? 'Loading...' : studentName}
        </h1>
        <div className="mt-1 font-medium text-xl">Great To See You Again </div>
        <div className='font-bold text-white-950 text-xl'>
          Check Your Classes, Timetable, Homework, And Attendance On Your Dashboard.
        </div>
      </div>
    </div>
  );
}

export default GreetingCard;