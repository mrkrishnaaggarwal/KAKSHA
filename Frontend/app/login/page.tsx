'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';

const page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isStudent, setIsStudent] = useState(true);
  const [isProfessor, setIsProfessor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  
  const handelClickStudent = () => {
    if (isStudent) return;
    else {
      setIsStudent(true);
      setIsProfessor(false);
    }
  }
  
  const handelClickProfessor = () => {
    if (isProfessor) return;
    else {
      setIsProfessor(true);
      setIsStudent(false);
    }
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isStudent) {
     console.log("Student");
      try {
        const response = await axios.post('http://localhost:8080/api/v1/student/login', {
          email,
          password
        }, {
          withCredentials: true
        });
        console.log(response);
        if (response.status === 200) {
          localStorage.setItem('token', response.data.data.tokens.accessToken); 
          localStorage.setItem('role','student');
          router.push('/student/dashboard');
        } else {
          alert('Login failed. Please check your credentials.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    else if (isProfessor) {
      console.log("Professor");
      try {
        const response = await axios.post('http://localhost:8080/api/v1/professor/login', {
          email,
          password
        }, {
          withCredentials: true
        });

        if (response.status === 200) {
          localStorage.setItem('token', response.data.data.tokens.accessToken);  
          localStorage.setItem('role','professor');
          router.push('/professor/dashboard');
        } else {
          alert('Login failed. Please check your credentials.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    else {
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
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-center mb-4">Enter your email and password to sign in</p>

        <div className="flex mb-4">
          <button
            type="button"
            className={`flex-1 py-2 font-semibold rounded-l-lg transition-colors duration-500 ease-in-out ${isStudent ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            onClick={handelClickStudent}
          >
            Student
          </button>
          <button
            type="button"
            className={`flex-1 py-2 font-semibold rounded-r-lg transition-colors duration-500 ease-in-out ${!isStudent ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'}`}
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
            <input
              type="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 mb-4 text-white bg-purple-500 rounded-lg hover:bg-purple-600 disabled:bg-purple-300"
            disabled={isLoading}
          >
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;