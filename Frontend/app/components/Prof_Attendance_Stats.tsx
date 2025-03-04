"use client";
import React from 'react';
import { FaUserCheck, FaUserMinus, FaUserClock, FaUsers } from 'react-icons/fa';

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

interface StatsProps {
  stats: {
    present: number;
    absent: number;
    tardy: number;
    total: number;
  };
  selectedDate: number | null;
  currentDate: Date;
  selectedClass: string;
  attendanceData: AttendanceData;
  showClassSpecific?: boolean;
}

const AttendanceStats: React.FC<StatsProps> = ({
  stats,
  selectedDate,
  currentDate,
  selectedClass,
  attendanceData,
  showClassSpecific = false
}) => {
  // Calculate selected date stats
  const getSelectedDateStats = () => {
    if (!selectedDate) return null;
    
    const dateString = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      selectedDate
    ).toISOString().split('T')[0];

    const data = attendanceData[dateString];
    if (!data) return null;

    // If showClassSpecific is true and class data exists, show stats for that class
    if (showClassSpecific && data.classData && data.classData[selectedClass]) {
      const classData = data.classData[selectedClass];
      return {
        ...classData,
        total: classData.present + classData.absent + classData.tardy
      };
    }
    
    // Otherwise show overall stats
    return {
      ...data,
      total: data.present + data.absent + data.tardy
    };
  };

  const selectedDateStats = getSelectedDateStats();
  
  // Determine which stats to display
  const displayStats = selectedDateStats || stats;
  
  // Calculate percentages for progress bars (with safety checks)
  const totalCount = displayStats.total || 1; // Prevent division by zero
  const presentPercent = totalCount > 0 ? Math.round((displayStats.present / totalCount) * 100) : 0;
  const absentPercent = totalCount > 0 ? Math.round((displayStats.absent / totalCount) * 100) : 0;
  const tardyPercent = totalCount > 0 ? Math.round((displayStats.tardy / totalCount) * 100) : 0;

  return (
    <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
        <FaUsers className="text-blue-600" /> 
        {selectedDateStats 
          ? `Attendance for ${selectedClass} on ${selectedDate}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}` 
          : 'Current Attendance Statistics'}
      </h3>

      <div className="space-y-4">
        {/* Present */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center text-sm font-medium">
              <FaUserCheck className="text-green-500 mr-2" /> Present
            </div>
            <div className="text-green-600 font-semibold">
              {displayStats.present} / {totalCount} ({presentPercent}%)
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full" 
              style={{ width: `${presentPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Absent */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center text-sm font-medium">
              <FaUserMinus className="text-red-500 mr-2" /> Absent
            </div>
            <div className="text-red-600 font-semibold">
              {displayStats.absent} / {totalCount} ({absentPercent}%)
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-red-500 h-2.5 rounded-full" 
              style={{ width: `${absentPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Tardy */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center text-sm font-medium">
              <FaUserClock className="text-blue-500 mr-2" /> Tardy
            </div>
            <div className="text-blue-600 font-semibold">
              {displayStats.tardy} / {totalCount} ({tardyPercent}%)
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-500 h-2.5 rounded-full" 
              style={{ width: `${tardyPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Class-specific breakdown */}
      {showClassSpecific && selectedDateStats && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-700 mb-2">
            {selectedClass} Attendance
          </h4>
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center">
              <span className="w-3 h-3 inline-block bg-green-500 rounded-full mr-1"></span>
              Present: {displayStats.present}
            </span>
            <span className="inline-flex items-center">
              <span className="w-3 h-3 inline-block bg-red-500 rounded-full mr-1"></span>
              Absent: {displayStats.absent}
            </span>
            <span className="inline-flex items-center">
              <span className="w-3 h-3 inline-block bg-blue-500 rounded-full mr-1"></span>
              Tardy: {displayStats.tardy}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceStats;