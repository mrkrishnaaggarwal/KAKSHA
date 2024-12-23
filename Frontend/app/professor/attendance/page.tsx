"use client";
import React, { useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

interface AttendanceData {
  [date: string]: {
    present: number;
    absent: number;
    tardy: number;
  };
}

const page = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const classes = ['CSA', 'CSB', 'CSC'];
  const students = ['Himank', 'Krishna', 'Nikhil Sharma', 'Nitesh', 'Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay','Tanmay'];
  const [selectedClass, setSelectedClass] = useState('CSA');
  const [attendance, setAttendance] = useState(
    students.map((student) => ({ name: student, status: 'Present' }))
  );

  // Sample attendance data
  const attendanceData: AttendanceData = {
    "2024-12-21": {
      present: 2,
      absent: 2,
      tardy: 1,
    },
    "2024-12-22": {
      present: 2,
      absent: 2,
      tardy: 1,
    },
    "2024-12-23": {
      present: 2,
      absent: 2,
      tardy: 1,
    },
  };

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

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const handleDateClick = (date: number) => {
    setSelectedDate(date); // Set the selected date
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    ).toISOString().split('T')[0];
    console.log('Clicked date:', clickedDate);
  };

  const isToday = (date: number) => {
    const today = new Date();
    return (
      date === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleStatusChange = (index: number, status: string) => {
    setAttendance((prev) => {
      const updated = [...prev];
      updated[index].status = status;
      return updated;
    });
  };

  const handleSave = () => {
    console.log('Attendance for', selectedClass, currentDate, attendance);
    alert('Attendance saved! Check console for details.');
  };


  const renderAttendanceData = (date: number) => {
    const dateString = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    )
      .toISOString()
      .split('T')[0];

    const data = attendanceData[dateString];

    if (data) {
      return (
        <div className="flex flex-col gap-0.5 mt-1">
          {data.present > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-white min-h-fit flex-grow bg-green-500 rounded-sm p-1">
                P : {data.present}
              </span>
            </div>
          )}
          {data.absent > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-white min-h-fit flex-grow bg-red-500 rounded-sm p-1">
                A : {data.absent}
              </span>
            </div>
          )}
          {data.tardy > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-white min-h-fit flex-grow bg-blue-500 rounded-sm p-1">
                T : {data.tardy}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 w-[85%]">
      <div className="w-full mx-auto bg-white shadow rounded-lg p-4">
        <h1 className="text-3xl font-bold mb-4">Mark Attendance</h1>
        <div className="flex">
          <div className="w-1/2 pr-4">
            {/* Calendar Section */}
            <div className="w-full max-w-3xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1 text-sm bg-gray-500 text-white rounded"
                  >
                    today
                  </button>
                  <button
                    onClick={handlePrevMonth}
                    className="p-1 bg-gray-700 text-white rounded"
                  >
                    <MdChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1 bg-gray-700 text-white rounded"
                  >
                    <MdChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 border border-gray-200">
                {days.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center border-b border-gray-200 font-medium"
                  >
                    {day}
                  </div>
                ))}

                {Array.from({ length: firstDayOfMonth }).map((_, index) => {
                  const prevMonthDate =
                    lastDateOfPrevMonth - firstDayOfMonth + index + 1;
                  return (
                    <div
                      key={`prev-${index}`}
                      className="p-2 min-h-16 border border-gray-200 text-gray-400"
                    >
                      {prevMonthDate}
                    </div>
                  );
                })}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const date = index + 1;
                  return (
                    <button
                      key={date}
                      onClick={() => handleDateClick(date)}
                      className={`p-1 min-h-16 border border-gray-200 relative w-full text-left ${
                        isToday(date)
                          ? 'bg-yellow-100'
                          : selectedDate === date
                          ? 'bg-blue-100'
                          : ''
                      }`}
                    >
                      <div className='text-center'>{date}</div>
                      {renderAttendanceData(date)}
                    </button>
                  );
                })}

                {Array.from({
                  length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7,
                }).map((_, index) => (
                  <div
                    key={`next-${index}`}
                    className="p-2 min-h-16 border border-gray-200 text-gray-400"
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Attendance Section */}
          <div className="w-1/2 pl-4">
            <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border border-gray-300 rounded p-2 mb-2"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
            </select>
            <div className="space-y-4 max-h-96 overflow-y-scroll">
              {attendance.map((student, index) => (
                <div
                  key={student.name}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span>{student.name}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleStatusChange(index, 'Present')}
                      className={`px-4 py-2 rounded ${
                        student.status === 'Present'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleStatusChange(index, 'Absent')}
                      className={`px-4 py-2 rounded ${
                        student.status === 'Absent'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => handleStatusChange(index, 'Tardy')}
                      className={`px-4 py-2 rounded ${
                        student.status === 'Tardy'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      Tardy
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              className="mt-1 bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
