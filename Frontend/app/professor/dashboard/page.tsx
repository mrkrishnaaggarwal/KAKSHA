'use client'
import ProfessorDashboard from '@/app/page/ProfessorDashboard'
import React from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
const page = () => {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);
  return (
    <div className='flex-1 min-h-screen overflow-auto'>
      <ProfessorDashboard />
    </div>
  )
}

export default page