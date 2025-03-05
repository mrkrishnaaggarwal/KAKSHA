'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfessorDashboard from '@/app/page/ProfessorDashboard';

const ProfessorDashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex-1 min-h-screen overflow-auto">
      <ProfessorDashboard />
    </div>
  );
};

export default ProfessorDashboardPage;