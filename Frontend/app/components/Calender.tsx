
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AiOutlineLeft, 
  AiOutlineRight, 
  AiOutlineClockCircle, 
  AiOutlineEnvironment 
} from "react-icons/ai";

type Class = {
  id: number;
  subject: string;
  time: string;
  room: string;
  color: string;
};

const sampleClassSchedule: Record<string, Class[]> = {
  "2025-03-04": [
    { 
      id: 1, 
      subject: "Mathematics", 
      time: "09:00 AM", 
      room: "A-101",
      color: "bg-blue-100 border-blue-300 text-blue-800"
    },
    { 
      id: 2, 
      subject: "Physics Lab", 
      time: "11:00 AM", 
      room: "L-203",
      color: "bg-purple-100 border-purple-300 text-purple-800"
    },
  ],
  "2025-03-05": [
    { 
      id: 4, 
      subject: "Computer Science", 
      time: "10:00 AM", 
      room: "T-310",
      color: "bg-emerald-100 border-emerald-300 text-emerald-800"
    },
  ],
  "2025-03-06": [
    { 
      id: 6, 
      subject: "Chemistry", 
      time: "09:30 AM", 
      room: "B-103",
      color: "bg-indigo-100 border-indigo-300 text-indigo-800"
    }
  ],
};

export default function Calendar() {
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [classes, setClasses] = useState<Class[]>([]);

  // Format date as YYYY-MM-DD for schedule lookup
  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Load classes for the currently selected date
  useEffect(() => {
    const dateKey = formatDateKey(selectedDate);
    setClasses(sampleClassSchedule[dateKey] || []);
  }, [selectedDate]);

  // Navigate to the previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to the next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Check if two dates are exactly equal
  const isSameDate = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Generate an array of day objects to build the calendar grid
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ date: null, isCurrentMonth: false });
    }

    // Add day cells for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateKey = formatDateKey(date);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDate(date, new Date()),
        isSelected: isSameDate(date, selectedDate),
        hasClasses: Boolean(sampleClassSchedule[dateKey]),
        classCount: sampleClassSchedule[dateKey]?.length || 0,
      });
    }
    return days;
  };

  const days = getDaysInMonth();

  const selectedDateStr = selectedDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-blue-50 border-b border-blue-100 px-3 py-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Class Schedule</h3>
          <div className="text-xs font-medium bg-blue-600 text-white px-2 py-0.5 rounded-full">
            Today
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700">
          {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </h4>
        <div className="flex space-x-1">
          <button 
            onClick={prevMonth} 
            className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <AiOutlineLeft size={14} />
          </button>
          <button 
            onClick={nextMonth}
            className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <AiOutlineRight size={14} />
          </button>
        </div>
      </div>

      {/* Mini Calendar Grid */}
      <div className="px-2 pt-2 pb-3">
        <div className="grid grid-cols-7 mb-1">
          {["S", "M", "T", "W", "TH", "F", "SA"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={index}>
              {day.date ? (
                <motion.button
                  whileHover={{ scale: 0.9 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setSelectedDate(day.date)}
                  className={`w-full aspect-square flex flex-col items-center justify-center rounded-full text-xs
                    ${day.isSelected ? 'bg-blue-600 text-white' : 
                      day.isToday ? 'bg-blue-100 text-blue-800' : 
                      'hover:bg-gray-100 text-gray-800'}
                    ${day.hasClasses && !day.isSelected ? 'font-bold' : ''}
                  `}
                >
                  {day.date.getDate()}
                  {day.hasClasses && !day.isSelected && (
                    <div className="h-1 w-1 rounded-full bg-blue-600 mt-0.5"></div>
                  )}
                </motion.button>
              ) : (
                <div className="w-full aspect-square" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Classes for the Selected Date */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="px-3 py-2 flex items-center justify-between">
          <h4 className="text-xs font-medium text-gray-700">
            {selectedDateStr}
          </h4>
          <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
            {classes.length}
          </span>
        </div>
        <div className="px-3 pb-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={formatDateKey(selectedDate)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="space-y-2"
            >
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-2 rounded border-l-2 ${cls.color}`}
                  >
                    <div className="text-sm font-medium">{cls.subject}</div>
                    <div className="mt-1 space-y-1 text-xs">
                      <div className="flex items-center text-gray-600">
                        <AiOutlineClockCircle className="mr-1" size={12} />
                        <span>{cls.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <AiOutlineEnvironment className="mr-1" size={12} />
                        <span>{cls.room}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4 text-xs text-gray-500"
                >
                  No classes scheduled
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
