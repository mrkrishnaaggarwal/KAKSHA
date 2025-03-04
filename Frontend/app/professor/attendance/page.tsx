"use client";
import React, { useState, useEffect } from 'react';
import AttendanceCalendar from '@/app/components/Prof_Attendance_Calender';
import AttendanceStats from '@/app/components/Prof_Attendance_Stats';
import AttendanceForm from '@/app/components/Prof_Attendance_Mark';

interface AttendanceData {
  [date: string]: {
    present: number;
    absent: number;
    tardy: number;
    classData?: {
      [className: string]: {
        present: number;
        absent: number;
        tardy: number;
      }
    }
  };
}

interface StudentAttendance {
  name: string;
  status: 'Present' | 'Absent' | 'Tardy';
  rollNumber?: string;
}

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const classes = ['CSA', 'CSB', 'CSC'];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState('CSA');
  
  // Sample student data with roll numbers
  const studentData = [
    { name: 'Himank', rollNumber: 'CS001' },
    { name: 'Krishna', rollNumber: 'CS002' },
    { name: 'Nikhil Sharma', rollNumber: 'CS003' },
    { name: 'Nitesh', rollNumber: 'CS004' },
    { name: 'Tanmay', rollNumber: 'CS005' },
    { name: 'Aarav', rollNumber: 'CS006' },
    { name: 'Rohan', rollNumber: 'CS007' },
    // Include all other students with roll numbers
    { name: 'Karthik', rollNumber: 'CS008' },
    { name: 'Aditya', rollNumber: 'CS009' },
    { name: 'Viraj', rollNumber: 'CS010' },
    { name: 'Neel', rollNumber: 'CS011' },
    { name: 'Siddharth', rollNumber: 'CS012' },
    { name: 'Manav', rollNumber: 'CS013' },
    { name: 'Aryan', rollNumber: 'CS014' },
    { name: 'Omkar', rollNumber: 'CS015' },
    { name: 'Vihaan', rollNumber: 'CS016' },
    { name: 'Devansh', rollNumber: 'CS017' },
    { name: 'Ishan', rollNumber: 'CS018' },
    { name: 'Kabir', rollNumber: 'CS019' },
    { name: 'Shaurya', rollNumber: 'CS020' },
    { name: 'Yash', rollNumber: 'CS021' },
    { name: 'Rahul', rollNumber: 'CS022' },
    { name: 'Sanket', rollNumber: 'CS023' },
    { name: 'Harsh', rollNumber: 'CS024' },
    { name: 'Pranav', rollNumber: 'CS025' },
    { name: 'Arjun', rollNumber: 'CS026' },
    { name: 'Eshan', rollNumber: 'CS027' },
  ];
  
  const [attendance, setAttendance] = useState<StudentAttendance[]>(
    studentData.map((student) => ({ 
      name: student.name, 
      status: 'Present', 
      rollNumber: student.rollNumber 
    }))
  );

  // Sample attendance data with class-specific information
  const attendanceData: AttendanceData = {
    "2024-12-21": {
      present: 20,
      absent: 5,
      tardy: 2,
      classData: {
        "CSA": { present: 8, absent: 2, tardy: 1 },
        "CSB": { present: 7, absent: 1, tardy: 0 },
        "CSC": { present: 5, absent: 2, tardy: 1 }
      }
    },
    "2024-12-22": {
      present: 18,
      absent: 7,
      tardy: 2,
      classData: {
        "CSA": { present: 7, absent: 3, tardy: 0 },
        "CSB": { present: 6, absent: 2, tardy: 1 },
        "CSC": { present: 5, absent: 2, tardy: 1 }
      }
    },
    "2024-12-23": {
      present: 22,
      absent: 3,
      tardy: 2,
      classData: {
        "CSA": { present: 9, absent: 1, tardy: 0 },
        "CSB": { present: 8, absent: 0, tardy: 1 },
        "CSC": { present: 5, absent: 2, tardy: 1 }
      }
    },
  };

  // Attendance statistics
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    tardy: 0,
    total: studentData.length
  });

  // Update stats when attendance changes
  useEffect(() => {
    const present = attendance.filter(s => s.status === 'Present').length;
    const absent = attendance.filter(s => s.status === 'Absent').length;
    const tardy = attendance.filter(s => s.status === 'Tardy').length;
    
    setStats({
      present,
      absent,
      tardy,
      total: attendance.length
    });
  }, [attendance]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // FIX 1: Add missing calendar navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today.getDate());
  };

  const handleDateClick = (date: number) => {
    setSelectedDate(date);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
  };

  const handleStatusChange = (index: number, status: 'Present' | 'Absent' | 'Tardy') => {
    setAttendance((prev) => {
      const updated = [...prev];
      updated[index].status = status;
      return updated;
    });
  };

  const handleBulkAction = (status: 'Present' | 'Absent' | 'Tardy') => {
    setAttendance(prev => prev.map(student => ({
      ...student,
      status
    })));
  };

  const handleSave = () => {
    const dateString = selectedDate 
      ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
      
    console.log('Attendance for', selectedClass, 'on', dateString, ':', attendance);
    
    const present = attendance.filter(s => s.status === 'Present').length;
    const absent = attendance.filter(s => s.status === 'Absent').length;
    const tardy = attendance.filter(s => s.status === 'Tardy').length;
    
    alert(`Attendance saved for ${selectedClass} on ${dateString}!\n\nPresent: ${present}\nAbsent: ${absent}\nTardy: ${tardy}`);
  };

  const filteredStudents = attendance.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (student.rollNumber && student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = selectedFilter ? student.status === selectedFilter : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 w-full overflow-auto">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8 text-white">
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-blue-100 mt-1">Keep track of your students' attendance records</p>
          
          {/* Date display and class selector */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              <span className="text-xl font-medium">{selectedDate 
                ? `${monthNames[currentDate.getMonth()]} ${selectedDate}, ${currentDate.getFullYear()}`
                : 'Select a date'}</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedClass}
                onChange={handleClassChange}
                className="bg-blue-900 border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row">
          {/* FIX 2: Make left sidebar sticky so it moves with scrolling */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
            {/* Calendar Component */}
            <AttendanceCalendar 
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              selectedDate={selectedDate}
              selectedClass={selectedClass}
              attendanceData={attendanceData}
              onDateClick={handleDateClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onTodayClick={handleTodayClick}
            />
            
            {/* FIX 3: Pass classSpecificStats flag to show class-wise attendance */}
            <AttendanceStats 
              stats={stats}
              selectedDate={selectedDate}
              currentDate={currentDate}
              selectedClass={selectedClass}
              attendanceData={attendanceData}
              showClassSpecific={true}
            />
          </div>

          {/* Right: Attendance Form */}
          <div className="w-full lg:w-1/2 p-6">
            <AttendanceForm
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              filteredStudents={filteredStudents}
              handleStatusChange={handleStatusChange}
              handleBulkAction={handleBulkAction}
              handleSave={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;