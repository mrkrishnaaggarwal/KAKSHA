'use client'
import React from 'react'
// import axios from 'axios';
// import { useEffect, useState } from 'react';
import MainLayout from '../../components/MainLayout';
// import Sidebar from '../Components/StudentSidebar';
// import Topbar from '../Components/Topbar';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
const StudentMyProfile = () => {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);    
  return (
    <div className="flex-1 min-h-screen overflow-auto">
    {/* <Sidebar /> */}
    <div className='w-[100%]'>
      {/* <Topbar /> */}
      <div className='flex'>
        <MainLayout phone='9819085' address='ghwehgoqh'/>
      </div>
    </div>
  </div>
  )
}

export default StudentMyProfile;