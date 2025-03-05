"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "@/app/components/MainLayout";
import { useRouter } from "next/navigation";

interface ProfessorProfile {
  id: string;
  roll_no: string;
  first_name: string;
  last_name: string;
  email: string;
  dept: string;
  date_of_join?: string;
  dob?: string;
  address?: string;
  has_photo: boolean;
}

const ProfessorMyProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfessorProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/v1/professor/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          console.log(response.data.data);
          setProfile(response.data.data);
        } else {
          setError("Failed to fetch profile data");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Unable to load profile information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-auto text-center">
          <div className="flex flex-col items-center justify-center">
            {/* Loading spinner */}
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
  
            {/* Loading text */}
            <h2 className="text-xl font-bold text-blue-800 mb-4">
              Loading Profile
            </h2>
            <p className="text-gray-600 mb-8">
              Please wait while we fetch your information...
            </p>
  
            {/* Skeleton loader elements */}
            <div className="w-full space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
  
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
  
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 className="text-2xl font-bold text-red-600 mt-4 mb-2">
            Profile Error
          </h2>
          <p className="text-gray-700 mb-6">
            {error || "Unable to load your profile"}
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push("/professor/dashboard")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-300"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate years of service from join date if available
  let yearsOfService = 0;
  if (profile.date_of_join) {
    try {
      const joinDate = new Date(profile.date_of_join);
      const today = new Date();
      yearsOfService = today.getFullYear() - joinDate.getFullYear();
      const monthDiff = today.getMonth() - joinDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < joinDate.getDate())) {
        yearsOfService--;
      }
    } catch (e) {
      console.error("Error calculating years of service:", e);
    }
  }

  // Calculate age from DOB if available
  let age = 40; // Default age
  if (profile.dob) {
    try {
      const birthDate = new Date(profile.dob);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    } catch (e) {
      console.error("Error calculating age:", e);
    }
  }

  return (
    <div className="flex-1 min-h-screen overflow-auto">
      <div className="w-[100%]">
        <MainLayout
          // Actual API data
          firstName={profile.first_name}
          lastName={profile.last_name}
          rollNo={profile.roll_no}
          email={profile.email}
          address={profile.address}
          dob={profile.dob}
          
          // Professor-specific data
          isProfessor={true}
          department={profile.dept}
          dateOfJoin={profile.date_of_join}
          yearsOfService={yearsOfService}
          
          // Pre-populated data (these would come from API in the future)
          gender="Male"
          age={age}
          bloodGroup="A+ve"
          specialization="Computer Science"
          qualification="PhD in Computer Science, MIT"
          researchInterests="Machine Learning, Artificial Intelligence, Computer Vision"
          publications="15+ research papers in international journals"
          officeHours="Monday-Thursday: 2PM-4PM"
          emergencyName="Mrs. Priya Sharma"
          emergencyContact="+91 9876543210"
          emergencyAddress="123 Faculty Housing, University Campus"
        />
      </div>
    </div>
  );
};

export default ProfessorMyProfile;