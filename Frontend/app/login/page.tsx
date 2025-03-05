
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from 'next/image';
import logo from '@/public/logoFinal.png';

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isStudent, setIsStudent] = useState(true);
  const [isProfessor, setIsProfessor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Add this with your other state variables at the top
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handelClickStudent = () => {
    if (isStudent) return;
    else {
      setIsStudent(true);
      setIsProfessor(false);
    }
  };

  const handelClickProfessor = () => {
    if (isProfessor) return;
    else {
      setIsProfessor(true);
      setIsStudent(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isStudent) {
      console.log("Student");
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/student/login",
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        );
        console.log(response);
        if (response.status === 200) {
          localStorage.setItem("token", response.data.data.tokens.accessToken);
          localStorage.setItem("role", "student");
          router.push("/student/dashboard");
        } else {
          alert("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred during login. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    } else if (isProfessor) {
      console.log("Professor");
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/professor/login",
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          localStorage.setItem("token", response.data.data.tokens.accessToken);
          localStorage.setItem("role", "professor");
          router.push("/professor/dashboard");
        } else {
          alert("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred during login. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Role error");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <video
        className="absolute w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/giphy.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="text-white bg-transparent border-2 border-[rgba(255,255,255,.2)] backdrop-blur-3xl bg-opacity-30 p-8 rounded-3xl shadow-2xl w-full max-w-md">
        {/* <img src="/logo.jpg" alt="logo" className="w-20 mx-auto mix-blend-multiply" /> */}
        {/* Add this right after the <div className="text-white bg-transparent..."> */}
        <div className="flex justify-center mb-6">
          {/* <div className="bg-purple-600 bg-opacity-80 p-3 rounded-xl shadow-lg border border-purple-400">
            <svg
              className="h-12 w-12 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div> */}
          <Image className="w-[80%] h-[50%]" src={logo} alt="logo" />
          <div>

          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-center mb-6 text-gray-100">
          Enter your credentials to access your account
        </p>

        <div className="flex mb-4">
          <button
            type="button"
            className={`flex-1 py-2 font-semibold rounded-l-lg transition-colors duration-500 ease-in-out ${
              isStudent
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={handelClickStudent}
          >
            Student
          </button>
          <button
            type="button"
            className={`flex-1 py-2 font-semibold rounded-r-lg transition-colors duration-500 ease-in-out ${
              !isStudent
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={handelClickProfessor}
          >
            Teacher
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block">Email</label>
            <input
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-black w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-black w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-2 text-gray-600 hover:text-purple-500"
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mb-4 text-white bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-md disabled:opacity-70 flex justify-center items-center font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                SIGNING IN...
              </>
            ) : (
              "SIGN IN"
            )}
          </button>
        </form>
        <div className="text-center mt-4 text-sm text-gray-300">
          <p>© 2025 BEROZGAAR Academic Portal</p>
          <p className="mt-1">All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default page;
