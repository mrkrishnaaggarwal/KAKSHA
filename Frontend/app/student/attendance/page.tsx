"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineBook,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";

// Type definitions
interface DayAttendance {
  status: string;
  subject: string;
}

interface SubjectAttendance {
  subject: string;
  total_classes: string;
  present_count: string;
}

export default function AttendancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [dayLoading, setDayLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Attendance data state
  const [dayAttendance, setDayAttendance] = useState<DayAttendance[]>([]);
  const [subjectAttendance, setSubjectAttendance] = useState<
    SubjectAttendance[]
  >([]);

  // Format date as YYYY-MM-DD
  // Fixed function
  const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Check authentication and fetch overall attendance data (only once on mount)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchOverallAttendance = async () => {
      setLoading(true);
      try {
        // Fetch overall attendance statistics
        const attendanceResponse = await axios.get(
          "http://localhost:8080/api/v1/student/attendance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setSubjectAttendance(attendanceResponse.data.data || []);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching overall attendance data:", error);

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        setError("Failed to load attendance data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverallAttendance();
  }, [router]); // Only run on component mount

  // Fetch day-specific attendance data when selectedDate changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchDayAttendance = async () => {
      setDayLoading(true);
      try {
        // Fetch attendance for selected day
        console.log("Fetching attendance for", formatDateKey(selectedDate));
        const dayAttendanceResponse = await axios.get(
          `http://localhost:8080/api/v1/student/day-attendance?date=${formatDateKey(
            selectedDate
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setDayAttendance(dayAttendanceResponse.data.data || []);
      } catch (error: any) {
        console.error("Error fetching day attendance data:", error);
        setDayAttendance([]);
      } finally {
        setDayLoading(false);
      }
    };

    fetchDayAttendance();
  }, [selectedDate]); // Run when selectedDate changes

  // Calendar navigation functions
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Calendar helper functions
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
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDate(date, new Date()),
        isSelected: isSameDate(date, selectedDate),
      });
    }
    return days;
  };

  const days = getDaysInMonth();

  const selectedDateStr = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Calculate attendance percentages for subject cards
  const getAttendancePercentage = (subject: SubjectAttendance) => {
    const present = parseInt(subject.present_count);
    const total = parseInt(subject.total_classes);
    return total > 0 ? Math.round((present / total) * 100) : 0;
  };

  // Determine color based on attendance percentage
  const getAttendanceColorClass = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-purple-100 via-white to-white p-1 md:p-2 lg:p-4 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Page Header - Updated with matching gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 lg:p-7">
            <h1 className="text-white text-2xl md:text-3xl font-bold flex items-center">
              <AiOutlineCalendar className="mr-3" size={28} />
              Attendance Dashboard
            </h1>
            <p className="text-blue-100 mt-2 text-lg">
              Track your class attendance and performance
            </p>
          </div>

          {/* Loading State - Only show when the entire page is loading */}
          {loading && (
            <div className="flex flex-col justify-center items-center h-80">
              <div className="relative">
                <div className="w-12 h-12 border-2 border-gray-200 border-opacity-60 rounded-full"></div>
                <div className="absolute top-0 left-0 w-12 h-12 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-3 text-gray-600 text-sm font-normal">
                Loading content...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 m-8 rounded-lg shadow-sm">
              <div className="flex items-center">
                <svg
                  className="h-7 w-7 text-red-500 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="font-medium text-lg">{error}</p>
              </div>
              <button
                className="mt-4 text-base text-red-600 hover:text-red-800 font-semibold flex items-center"
                onClick={() => window.location.reload()}
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="md:flex">
              {/* Left Section: Calendar */}
              {/* Left Section: Calendar */}
              <div className="md:w-[45%] md:h-3/4 p-6 lg:p-8 border-b md:border-b-0 md:border-r border-gray-200">
                <div className="max-w-md mx-auto lg:max-w-full">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {currentMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h2>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedDate(new Date())}
                        className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                      >
                        Today
                      </button>
                      <button
                        onClick={prevMonth}
                        className="p-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center"
                      >
                        <AiOutlineLeft size={16} />
                      </button>
                      <button
                        onClick={nextMonth}
                        className="p-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center"
                      >
                        <AiOutlineRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 md:gap-3">
                    {["S", "M", "T", "W", "Th", "F", "Sa"].map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500 mb-2"
                      >
                        {day}
                      </div>
                    ))}

                    {days.map((day, index) => (
                      <div key={index} className="flex justify-center">
                        {day.date ? (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedDate(day.date!)}
                            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all
                            ${
                              day.isSelected
                                ? "bg-purple-600 text-white shadow-md"
                                : day.isToday
                                ? "bg-purple-100 text-purple-800 border border-purple-300"
                                : "hover:bg-purple-50 text-gray-700"
                            }
                          `}
                          >
                            {day.date.getDate()}
                          </motion.button>
                        ) : (
                          <div className="w-10 h-10"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Date Attendance with more space */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <AiOutlineClockCircle
                      className="mr-2 text-purple-600"
                      size={20}
                    />
                    Attendance for {selectedDateStr}
                  </h3>

                  {/* Only this section updates when a new date is selected */}
                  <AnimatePresence mode="wait">
                    {dayLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-12 flex justify-center"
                      >
                        <div className="relative w-8 h-8">
                          <div className="w-8 h-8 border-2 border-gray-200 border-opacity-60 rounded-full"></div>
                          <div className="absolute top-0 left-0 w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={formatDateKey(selectedDate)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        {dayAttendance.length > 0 ? (
                          dayAttendance.map((item, index) => (
                            <motion.div
                              key={`${formatDateKey(selectedDate)}-${index}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`flex items-center p-4 rounded-lg border ${
                                item.status === "Present"
                                  ? "bg-green-50 border-green-200 hover:shadow-sm transition-all"
                                  : item.status === "Absent"
                                  ? "bg-red-50 border-red-200 hover:shadow-sm transition-all"
                                  : "bg-yellow-50 border-yellow-200 hover:shadow-sm transition-all"
                              }`}
                            >
                              {item.status === "Present" ? (
                                <div className="bg-green-100 p-1.5 rounded-full mr-4">
                                  <AiOutlineCheckCircle
                                    className="text-green-600 flex-shrink-0"
                                    size={22}
                                  />
                                </div>
                              ) : item.status === "Absent" ? (
                                <div className="bg-red-100 p-1.5 rounded-full mr-4">
                                  <AiOutlineCloseCircle
                                    className="text-red-600 flex-shrink-0"
                                    size={22}
                                  />
                                </div>
                              ) : (
                                <div className="bg-yellow-100 p-1.5 rounded-full mr-4">
                                  <AiOutlineClockCircle
                                    className="text-yellow-600 flex-shrink-0"
                                    size={22}
                                  />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-lg">
                                  {item.subject}
                                </div>
                                <div
                                  className={`text-base ${
                                    item.status === "Present"
                                      ? "text-green-700"
                                      : item.status === "Absent"
                                      ? "text-red-700"
                                      : "text-yellow-700"
                                  }`}
                                >
                                  {item.status}
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-10 px-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                              <AiOutlineCalendar
                                className="text-gray-400"
                                size={28}
                              />
                            </div>
                            <p className="text-gray-500 font-medium text-lg">
                              No attendance records found
                            </p>
                            <p className="text-base text-gray-400 mt-2">
                              There are no classes recorded for this date
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Section: Overall Attendance Statistics */}
              <div className="md:w-[55%] p-6 lg:p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <AiOutlineBook className="mr-2 text-purple-600" size={20} />
                  Attendance Statistics
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {subjectAttendance.map((subject, index) => {
                    const percentage = getAttendancePercentage(subject);
                    const colorClass = getAttendanceColorClass(percentage);

                    return (
                      <motion.div
                        key={subject.subject}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                      >
                        <div className="p-4 lg:p-5">
                          {/* Subject header with pill */}
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-lg text-gray-800">
                              {subject.subject}
                            </h4>
                            <span
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                percentage >= 75
                                  ? "bg-green-100 text-green-800"
                                  : percentage >= 60
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {percentage}%
                            </span>
                          </div>

                          {/* Class count indicator */}
                          <div className="flex items-center text-sm text-gray-500 my-3">
                            <svg
                              className="w-4 h-4 mr-1.5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>
                              {subject.present_count} of {subject.total_classes}{" "}
                              classes attended
                            </span>
                          </div>

                          {/* Progress bar with improved styling */}
                          <div className="mt-3 mb-1">
                            <div className="flex justify-between text-xs font-medium mb-1">
                              <span>Attendance</span>
                              <span className="text-gray-700">
                                {percentage}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`h-2.5 rounded-full ${colorClass} transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Status indicator */}
                          <div className="text-xs mt-3 flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                percentage >= 75
                                  ? "bg-green-500"
                                  : percentage >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            {percentage >= 75 ? (
                              <span className="text-green-600 font-medium">
                                Good attendance
                              </span>
                            ) : percentage >= 60 ? (
                              <span className="text-yellow-600 font-medium">
                                Needs improvement
                              </span>
                            ) : (
                              <span className="text-red-600 font-medium">
                                Low attendance
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {subjectAttendance.length === 0 && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-2 text-center py-12 px-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium text-lg">
                        No attendance statistics available
                      </p>
                      <p className="text-gray-400 mt-2">
                        Your attendance records will appear here once available
                      </p>
                    </div>
                  )}
                </div>

                {/* Overall Attendance Summary */}
                {subjectAttendance.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 bg-gray-50 rounded-lg p-5 border border-gray-200"
                  >
                    <h4 className="text-gray-800 font-medium text-lg mb-3">
                      Overall Summary
                    </h4>

                    {(() => {
                      // Calculate overall attendance
                      let totalPresent = 0;
                      let totalClasses = 0;

                      subjectAttendance.forEach((subject) => {
                        totalPresent += parseInt(subject.present_count);
                        totalClasses += parseInt(subject.total_classes);
                      });

                      const overallPercentage =
                        totalClasses > 0
                          ? Math.round((totalPresent / totalClasses) * 100)
                          : 0;

                      const colorClass =
                        getAttendanceColorClass(overallPercentage);

                      return (
                        <>
                          <div className="flex justify-between text-base mb-2">
                            <span className="text-gray-600">
                              Overall Attendance
                            </span>
                            <span className="font-semibold">
                              {overallPercentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                            <div
                              className={`h-3 rounded-full ${colorClass}`}
                              style={{ width: `${overallPercentage}%` }}
                            ></div>
                          </div>
                          <p className="text-base mt-2">
                            {overallPercentage >= 75 ? (
                              <span className="text-green-700">
                                You're maintaining good attendance across all
                                subjects.
                              </span>
                            ) : overallPercentage >= 60 ? (
                              <span className="text-yellow-700">
                                Your attendance needs improvement in some
                                subjects.
                              </span>
                            ) : (
                              <span className="text-red-700">
                                Your attendance is below required levels. Please
                                improve.
                              </span>
                            )}
                          </p>
                        </>
                      );
                    })()}
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
