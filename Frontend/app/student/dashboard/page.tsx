'use client'

import StudentDashboard from '@/app/page/StudentDashboard'
import React from 'react'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const page = () => {

  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
      return;
    }
  }, [router]);

  return (
    <div className='flex-1 bg-gradient-to-b from-purple-100 via-white to-white p-1 md:p-2 lg:p-4 overflow-auto'>
      <StudentDashboard />
    </div>
  )
}

export default page
