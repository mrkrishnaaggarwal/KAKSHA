// "use client"
// import React from 'react';

// function GreetingCardProfessor({ name }: { name: string }) {
//   return (
//     <div className="relative rounded-xl max-h-fit ml-2 p-2 overflow-hidden">
//       <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-0">
//         <source src='/giphy.mp4' type="video/mp4" />
//       </video>
//       <div className="relative z-10 text-white p-2">
//         <h2 className="text-2xl font-bold">WELCOME BACK</h2>
//         <h1 className="text-2xl mt-1 font-semibold text-white-950">{name}</h1>
//         <div className="mt-1 font-medium text-xl">Great To See You Again </div>
//       </div>
//     </div>
//   );
// }

// export default GreetingCardProfessor;

"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ProfessorData {
  first_name: string;
  last_name: string;
}

function GreetingCardProfessor() {
  const [professorName, setProfessorName] = useState<string>("Professor");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get<{ data: ProfessorData, success: boolean }>
          ('http://localhost:8080/api/v1/professor/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          });

        if (response.data.success) {
          const { first_name, last_name } = response.data.data;
          setProfessorName(`${first_name} ${last_name}`);
        }
      } catch (error) {
        console.error('Failed to fetch professor data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessorData();
  }, []);

  // Get time of day for greeting
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="relative rounded-xl overflow-hidden h-48">
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-0">
        <source src='/giphy.mp4' type="video/mp4" />
      </video>
      <div className="relative z-10 text-white p-6 h-full flex flex-col justify-center">
        <h2 className="text-xl font-medium">{getGreeting()}</h2>
        <h1 className="text-3xl font-bold mt-1">
          {isLoading ? (
            <div className="h-8 w-48 bg-white bg-opacity-20 rounded animate-pulse"></div>
          ) : (
            professorName
          )}
        </h1>
        <div className="mt-4 font-medium">
          Manage Your Classes and Monitor Student Progress
        </div>
      </div>
    </div>
  );
}

export default GreetingCardProfessor;
