// src/TestCalender.tsx
"use client"
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/Calender.css';
import Classes from './Classes';

type DayClasses = { [key: string]: string[] };

const Calender: React.FC = () => {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [dayClasses, setDayClasses] = useState<string[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [isVisible, setIsVisible] = useState<boolean | null>(null);

  // Mock data for classes
  const mockClasses: DayClasses = {
    Monday: ["English Debate", "Art Class", "Programming", "DSA Practice", "Yoga", "Music"],
    Tuesday: ["Chemistry Lecture", "Group Discussion", "Machine Learning", "Drama Rehearsal", "Biology Class"],
    Wednesday: ["DSA", "Dance Practice", "Gymnastics", "Chemistry Lab", "Physics Seminar", "Art Workshop"],
    Thursday: ["Science Seminar", "Yoga", "AI Project Discussion", "JavaScript Coding", "Electronics Lab", "Geography Class"],
    Friday: ["Biology Lab", "Math Lecture", "AI Research", "Art Practice", "Robotics Seminar", "Yoga Class"]
  };

  const fetchClassesForDay = (dayName: string): string[] => {
    return mockClasses[dayName] || [];
  };

  const handleDateClick = (value: Date): void => {
    const day = value.getDay();
    const dayName = dayNames[day];

    if (day === 0 || day === 6) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
      setDayClasses(fetchClassesForDay(dayName));
    }
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  const handleClose = ()=>{
    setIsVisible(false);
    setDate(new Date());
  }

  return (
    <div className="bg-[rgb(157,78,221)] shadow-lg rounded-lg p-2 border-2 border-neutral-200">
      <Calendar
        onChange={(value) => {
          if (!value) return;
          setDate(Array.isArray(value) ? value[0] as Date : value as Date);
        }}
        value={date}
        onClickDay={handleDateClick}
        className="react-calendar"
        tileClassName={({ date }) => {
          if (isToday(date)) {
            return 'bg-blue-500 text-white rounded-md';
          }
          return 'text-center p-2 rounded-md transition-colors hover:bg-blue-100';
        }}
      />
      {isVisible && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2 text-white">Classes for {dayNames[date.getDay()]}:</h3>
          <div className="space-y-2">
            <Classes props={dayClasses} onClose={handleClose}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calender;
