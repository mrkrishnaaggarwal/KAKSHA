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
    <div className='flex-1 min-h-screen overflow-auto'>
      <StudentDashboard />
    </div>
  )
}

export default page
