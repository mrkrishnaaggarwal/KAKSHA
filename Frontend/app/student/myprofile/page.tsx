"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "@/app/components/MainLayout";
import { useRouter } from "next/navigation";

interface StudentProfile {
  id: string;
  roll_no: string;
  first_name: string;
  last_name: string;
  email: string;
  class_id?: string;
  class_name?: string;
  semester?: number;
  batch?: string;
  dob?: string;
  address?: string;
  has_photo: boolean;
}

const StudentMyProfile: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
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
          "http://localhost:8080/api/v1/student/profile",
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
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-auto text-center">
          <div className="flex flex-col items-center justify-center">
            {/* Loading spinner */}
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-6"></div>

            {/* Loading text */}
            <h2 className="text-xl font-bold text-purple-800 mb-4">
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-white">
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
              onClick={() => router.push("/student/dashboard")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-300"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate age from DOB if available
  let age = 20; // Default age
  if (profile.dob) {
    try {
      const birthDate = new Date(profile.dob);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
    } catch (e) {
      console.error("Error calculating age:", e);
    }
  }

  return (
    <div className="flex-1 min-h-screen overflow-auto bg-gradient-to-b from-purple-100 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Header Section */}
        {/* <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-t-xl shadow-md mb-6">
          <div className="px-6 py-5">
            <h1 className="text-white text-2xl md:text-3xl font-bold flex items-center">
              <svg
                className="mr-3"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Student Profile
            </h1>
            <p className="text-blue-100 mt-2 text-lg">
              Personal details and information
            </p>
          </div>
        </div> */}

        {/* Main Layout Container - Apply consistent styling */}
        <div className="bg-white rounded-b-xl shadow-md border border-gray-200 overflow-hidden">
          <MainLayout
            // Actual API data
            firstName={profile.first_name}
            lastName={profile.last_name}
            rollNo={profile.roll_no}
            email={profile.email}
            address={profile.address}
            className={profile.class_name}
            batch={profile.batch}
            semester={profile.semester as number}
            dob={profile.dob}
            // Pre-populated data (these would come from API in the future)
            gender="Male"
            age={age}
            bloodGroup="B+ve"
            previousGrades="69% | B+ (Good)"
            bestSubject="Mathematics"
            weakestSubject="Physics"
            parentName="Mr. Ashok Kumar Jackson"
            parentContact="+91 9868267234"
            parentOccupation="CEO at Fintech Software Private Limited, BBSR"
            emergencyName="Mr. Ashok Kumar Jackson"
            emergencyContact="+91 9868267234, +91 9868267234"
            emergencyAddress="Plot No.81, New Colony, Lane-17, VaniVihar, Bhubaneswar"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentMyProfile;
