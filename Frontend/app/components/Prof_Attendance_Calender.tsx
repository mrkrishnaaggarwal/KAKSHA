"use client";
import React from 'react';
import { MdChevronLeft, MdChevronRight, MdToday } from 'react-icons/md';

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

interface CalendarProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  selectedDate: number | null;
  selectedClass: string;
  attendanceData: AttendanceData;
  onDateClick: (date: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onTodayClick: () => void;
}

const AttendanceCalendar: React.FC<CalendarProps> = ({
  currentDate,
  selectedDate,
  selectedClass,
  attendanceData,
  onDateClick,
  onPrevMonth,
  onNextMonth,
  onTodayClick
}) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const lastDateOfPrevMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  ).getDate();

  const isToday = (date: number) => {
    const today = new Date();
    return (
      date === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const renderAttendanceData = (date: number) => {
    const dateString = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    ).toISOString().split('T')[0];

    const data = attendanceData[dateString];

    if (data) {
      // Get class-specific data if available, otherwise use overall data
      const displayData = data.classData && data.classData[selectedClass] 
        ? data.classData[selectedClass]
        : data;
        
      const total = displayData.present + displayData.absent + displayData.tardy;
      if (total === 0) return null;
      
      const presentPercent = (displayData.present / total) * 100;
      const absentPercent = (displayData.absent / total) * 100;
      const tardyPercent = (displayData.tardy / total) * 100;
      
      return (
        <div className="flex flex-col">
          <div className="w-full h-1.5 flex rounded-full overflow-hidden">
            <div className="bg-green-500" style={{ width: `${presentPercent}%` }}></div>
            <div className="bg-red-500" style={{ width: `${absentPercent}%` }}></div>
            <div className="bg-blue-500" style={{ width: `${tardyPercent}%` }}></div>
          </div>
          <div className="flex text-[8px] justify-between mt-0.5">
            <span className="text-green-600">{displayData.present}</span>
            <span className="text-red-600">{displayData.absent}</span>
            <span className="text-blue-600">{displayData.tardy}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <MdToday className="text-blue-600" size={20} />
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onTodayClick}
            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
          >
            <MdToday size={16} /> Today
          </button>
          <button
            onClick={onPrevMonth}
            className="p-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MdChevronLeft size={20} />
          </button>
          <button
            onClick={onNextMonth}
            className="p-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MdChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-7">
          {days.map((day) => (
            <div
              key={day}
              className="py-2.5 text-center bg-gray-50 text-gray-700 font-medium border-b border-gray-200"
            >
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayOfMonth }).map((_, index) => {
            const prevMonthDate = lastDateOfPrevMonth - firstDayOfMonth + index + 1;
            return (
              <div
                key={`prev-${index}`}
                className="p-2 min-h-[80px] border border-gray-100 text-gray-400 bg-gray-50"
              >
                <div className="text-center">{prevMonthDate}</div>
              </div>
            );
          })}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const date = index + 1;
            return (
              <button
                key={date}
                onClick={() => onDateClick(date)}
                className={`p-2 min-h-[80px] border border-gray-100 relative w-full text-left transition-all hover:bg-gray-50 
                  ${isToday(date)
                    ? 'ring-2 ring-blue-500 ring-inset'
                    : selectedDate === date
                    ? 'bg-blue-50 border-blue-200'
                    : ''
                  }`}
              >
                <div className={`${isToday(date) ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto mb-1' : 'text-center mb-1'}`}>
                  {date}
                </div>
                {renderAttendanceData(date)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;