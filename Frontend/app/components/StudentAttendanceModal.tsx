"use client";

import { useState, useEffect } from 'react';
import { HiOutlineX, HiOutlineSearch, HiOutlineDownload, HiOutlineCheck, HiOutlineX as HiOutlineXMark, HiOutlineSortAscending, HiOutlineSortDescending } from 'react-icons/hi';

type Student = {
  id: string;
  name: string;
  email: string;
  attendancePercentage: number;
  attendanceHistory: {
    date: string;
    status: 'present' | 'absent' | 'late';
  }[];
};

type StudentAttendanceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  subject: string;
  section: string;
  students: Student[];
};

export default function StudentAttendanceModal({
  isOpen,
  onClose,
  classId,
  subject,
  section,
  students
}: StudentAttendanceModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Initialize attendance status for today
  useEffect(() => {
    const initialStatus: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach(student => {
      const todayAttendance = student.attendanceHistory.find(a => a.date === currentDate);
      initialStatus[student.id] = todayAttendance?.status || 'absent';
    });
    setAttendanceStatus(initialStatus);
  }, [students, currentDate]);

  // Filter students based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(query) || 
      student.email.toLowerCase().includes(query)
    );
    
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  // Mark attendance for a student
  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Save attendance for all students
  const saveAttendance = () => {
    console.log('Saving attendance for', currentDate, attendanceStatus);
    // Here you would typically make an API call to save attendance data
    
    // Show success message
    alert('Attendance saved successfully!');
  };

  // Download attendance report
  const downloadReport = () => {
    console.log('Downloading attendance report');
    // Here you would generate and download a CSV/PDF report
  };

  // Sort students by attendance percentage
  const sortStudentsByAttendance = () => {
    const sorted = [...filteredStudents].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.attendancePercentage - b.attendancePercentage;
      } else {
        return b.attendancePercentage - a.attendancePercentage;
      }
    });
    setFilteredStudents(sorted);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{subject}</h2>
            <p className="text-gray-600">{section} - Attendance</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <HiOutlineX size={24} />
          </button>
        </div>
        
        {/* Modal controls */}
        <div className="border-b border-gray-200 px-6 py-3 flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 items-center">
            <button 
              onClick={sortStudentsByAttendance}
              className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md hover:bg-gray-100 flex items-center"
              title={sortDirection === 'asc' ? "Sort by lowest attendance" : "Sort by highest attendance"}
            >
              {sortDirection === 'asc' ? 
                <HiOutlineSortAscending size={20} /> : 
                <HiOutlineSortDescending size={20} />
              }
            </button>
          </div>
        </div>
        
        {/* Student list */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${student.attendancePercentage >= 75 ? 'bg-green-100 text-green-800' : 
                        student.attendancePercentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {student.attendancePercentage}%
                    </span>
                  </td>
                  
                </tr>
              ))}
              
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No students match your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Modal footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={saveAttendance}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
}