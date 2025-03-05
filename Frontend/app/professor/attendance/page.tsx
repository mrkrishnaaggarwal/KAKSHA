"use client";
import React, { useState, useEffect } from 'react';
import AttendanceCalendar from '@/app/components/Prof_Attendance_Calender';
import AttendanceStats from '@/app/components/Prof_Attendance_Stats';
import AttendanceForm from '@/app/components/Prof_Attendance_Mark';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
// Type definitions for API responses and component props
interface ClassData {
  timetable_id: number;
  class_id: number;
  class_name: string;
  subject: string;
  room: string;
  start_time: string;
  end_time: string;
}

interface Student {
  id: string;
  roll_no: string;
  first_name: string;
  last_name: string;
  email: string;
  semester: number;
  batch: string;
}

interface StudentAttendance {
  studentId: string;
  name: string;
  rollNumber: string;
  status: 'Present' | 'Absent' | 'Late';
}

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

const AttendancePage = () => {
  // Date related state
  const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState('');
  
  // API data state
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClassInfo, setSelectedClassInfo] = useState<ClassData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<StudentAttendance[]>([]);
  const router = useRouter();
  
  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    tardy: 0,
    total: 0
  });
  
  // Sample attendance data for calendar display
  const attendanceData: AttendanceData = {};
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);
  // Format date as YYYY-MM-DD for API calls
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        selectedDate
      );
      
      // Format date manually to ensure local date is preserved (YYYY-MM-DD)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      setFormattedDate(formattedDate);
      
      // Fetch classes when date changes
      fetchClasses(formattedDate);
    }
  }, [currentDate, selectedDate]);
  // Fetch classes for the selected date
  const fetchClasses = async (date: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const response = await axios.get(
        `http://localhost:8080/api/v1/professor/attendance/classes?date=${date}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials:true
        }
      );
      if (response.data.success === 200) {
        setClasses(response.data.data);
        // Auto-select first class if available
        if (response.data.data.length > 0) {
          setSelectedClassInfo(response.data.data[0]);
          fetchStudentsForClass(response.data.data[0].class_id);
        } else {
          setSelectedClassInfo(null);
          setStudents([]);
          setAttendance([]);
        }
      } else {
        toast.error(response.data.message || 'Failed to fetch classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch students for the selected class
  const fetchStudentsForClass = async (classId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.get(
        `http://localhost:8080/api/v1/professor/attendance/class/${classId}/students`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials:true
        }
      );
      console.log(response);
      if (response.data.success === 200) {
        setStudents(response.data.data);
        
        // Initialize attendance status for all students as 'Present'
        const initialAttendance = response.data.data.map((student: Student) => ({
          studentId: student.id,
          name: `${student.first_name} ${student.last_name}`,
          rollNumber: student.roll_no,
          status: 'Present' as const
        }));
        
        setAttendance(initialAttendance);
        
        // Update stats
        setStats({
          present: initialAttendance.length,
          absent: 0,
          tardy: 0,
          total: initialAttendance.length
        });
      } else {
        toast.error(response.data.message || 'Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle class selection change
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const timetableId = parseInt(e.target.value);
    const selectedClass = classes.find(c => c.timetable_id === timetableId);
    
    if (selectedClass) {
      setSelectedClassInfo(selectedClass);
      fetchStudentsForClass(selectedClass.class_id);
    }
  };
  
  // Update attendance status for a student
  const handleStatusChange = (index: number, status: 'Present' | 'Absent' | 'Late') => {
    setAttendance(prev => {
      const updated = [...prev];
      updated[index].status = status;
      return updated;
    });
  };
  
  // Set attendance status for all students
  const handleBulkAction = (status: 'Present' | 'Absent' | 'Late') => {
    setAttendance(prev => prev.map(student => ({
      ...student,
      status
    })));
  };
  
  // Submit attendance data to API
  const handleSave = async () => {
    if (!selectedClassInfo) {
      toast.error('Please select a class first');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const payload = {
        date: formattedDate,
        attendance: attendance.map(a => ({
          studentId: a.studentId,
          status: a.status
        }))
      };
      
      const response = await axios.post(
        `http://localhost:8080/api/v1/professor/attendance/timetable/${selectedClassInfo.timetable_id}/mark`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials:true
        }
      );
      
      if (response.data.success === 200) {
        toast.success('Attendance marked successfully!');
      } else {
        toast.error(response.data.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Update stats when attendance changes
  useEffect(() => {
    const present = attendance.filter(s => s.status === 'Present').length;
    const absent = attendance.filter(s => s.status === 'Absent').length;
    const tardy = attendance.filter(s => s.status === 'Late').length;
    
    setStats({
      present,
      absent,
      tardy,
      total: attendance.length
    });
  }, [attendance]);
  
  // Filter students based on search term and status filter
  const filteredStudents = attendance.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter ? student.status === selectedFilter : true;
    return matchesSearch && matchesFilter;
  });
  
  // Calendar navigation handlers
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
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="flex-1 min-h-screen overflow-auto">
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
              {loading ? (
                <div className="bg-blue-900 border-blue-300 rounded-lg px-3 py-2 text-blue-300">
                  Loading classes...
                </div>
              ) : (
                <select
                  value={selectedClassInfo?.timetable_id || ''}
                  onChange={handleClassChange}
                  className="bg-blue-900 border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {classes.length === 0 ? (
                    <option value="">No classes available</option>
                  ) : (
                    classes.map((cls) => (
                      <option key={cls.timetable_id} value={cls.timetable_id}>
                        {cls.class_name} - {cls.subject} ({formatTime(cls.start_time)} - {formatTime(cls.end_time)})
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Left sidebar */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
            {/* Calendar Component */}
            <AttendanceCalendar 
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              selectedDate={selectedDate}
              selectedClass={selectedClassInfo?.class_name || ''}
              attendanceData={attendanceData}
              onDateClick={handleDateClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onTodayClick={handleTodayClick}
            />
            
            {/* Stats Component */}
            <AttendanceStats 
              stats={stats}
              selectedDate={selectedDate}
              currentDate={currentDate}
              selectedClass={selectedClassInfo?.class_name || ''}
              attendanceData={attendanceData}
              showClassSpecific={true}
            />
            
            {/* Class Details Card */}
            {selectedClassInfo && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-800">Class Details</h3>
                <div className="mt-2 space-y-2 text-sm">
                  <p><span className="font-medium">Class:</span> {selectedClassInfo.class_name}</p>
                  <p><span className="font-medium">Subject:</span> {selectedClassInfo.subject}</p>
                  <p><span className="font-medium">Room:</span> {selectedClassInfo.room}</p>
                  <p><span className="font-medium">Time:</span> {formatTime(selectedClassInfo.start_time)} - {formatTime(selectedClassInfo.end_time)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Attendance Form */}
          <div className="w-full lg:w-1/2 p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time (HH:MM:SS -> h:MM AM/PM)
const formatTime = (timeStr: string): string => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${minutes} ${period}`;
};

export default AttendancePage;