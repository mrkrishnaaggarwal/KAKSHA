// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   AiOutlineLeft, 
//   AiOutlineRight, 
//   AiOutlineClockCircle, 
//   AiOutlineEnvironment,
//   AiOutlineUser,
//   AiOutlineExclamationCircle,
//   AiOutlineClose
// } from "react-icons/ai";
// import axios from "axios";

// // -----------------------------------------------------
// // Type definitions
// // -----------------------------------------------------
// type ClassDetails = {
//   subject: string;
//   startTime: string;
//   endTime: string;
//   room: string;
//   professor: string;
// };

// type WeekdayTimetable = {
//   [key: string]: ClassDetails[];
// };

// type CancelledClass = {
//   date: string;
//   subject: string;
//   start_time: string;
//   end_time: string;
// };

// type Class = {
//   id: number;
//   subject: string;
//   time: string;
//   startTime: string;
//   endTime: string;
//   room: string;
//   color: string;
//   professor: string;
//   isCancelled: boolean;
// };

// type CalendarDayInfo = {
//   date: Date | null;
//   isCurrentMonth: boolean;
//   isToday?: boolean;
//   isSelected?: boolean;
//   hasClasses?: boolean;
//   hasCancelledClasses?: boolean;
//   classCount?: number;
// };

// // -----------------------------------------------------
// // Helper Functions
// // -----------------------------------------------------
// const formatDateKey = (date: Date): string => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

// const formatTime = (timeStr: string): string => {
//   if (!timeStr) return "";
//   const [hours, minutes] = timeStr.split(":");
//   const h = parseInt(hours, 10);
//   const period = h >= 12 ? "PM" : "AM";
//   const hour = h % 12 || 12;
//   return `${hour}:${minutes || "00"} ${period}`;
// };

// // -----------------------------------------------------
// // Main Component
// // -----------------------------------------------------
// export default function Calendar() {
//   const [currentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [classes, setClasses] = useState<Class[]>([]);
//   const [timetableData, setTimetableData] = useState<Record<string, Class[]>>({});
//   const [cancelledClasses, setCancelledClasses] = useState<CancelledClass[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // -----------------------------------------------------
//   // Transform timetable API data
//   // -----------------------------------------------------
//   const transformTimetableData = (apiData: WeekdayTimetable): Record<string, Class[]> => {
//     const result: Record<string, Class[]> = {};
    
//     // Color mapping for subjects
//     const subjectColors: Record<string, string> = {};
//     const availableColors = [
//       "bg-blue-100 border-blue-300 text-blue-800",
//       "bg-purple-100 border-purple-300 text-purple-800",
//       "bg-emerald-100 border-emerald-300 text-emerald-800",
//       "bg-indigo-100 border-indigo-300 text-indigo-800",
//       "bg-amber-100 border-amber-300 text-amber-800",
//       "bg-rose-100 border-rose-300 text-rose-800",
//       "bg-cyan-100 border-cyan-300 text-cyan-800"
//     ];
    
//     // Day name to number mapping
//     const dayMapping: Record<string, number> = {
//       "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
//       "Thursday": 4, "Friday": 5, "Saturday": 6
//     };

//     // Process for each day in the current month
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
    
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month, day);
//       const dayOfWeekNum = date.getDay();
//       const dayName = Object.keys(dayMapping).find(
//         (key) => dayMapping[key] === dayOfWeekNum
//       );

//       if (dayName && apiData[dayName]) {
//         const dateKey = formatDateKey(date);
        
//         result[dateKey] = apiData[dayName].map((cls: ClassDetails, index: number) => {
//           if (!subjectColors[cls.subject]) {
//             subjectColors[cls.subject] =
//               availableColors[Object.keys(subjectColors).length % availableColors.length];
//           }
          
//           return {
//             id: index + 1,
//             subject: cls.subject,
//             time: `${formatTime(cls.startTime)} - ${formatTime(cls.endTime)}`,
//             startTime: cls.startTime,
//             endTime: cls.endTime,
//             room: cls.room || "TBA",
//             color: subjectColors[cls.subject],
//             professor: cls.professor || "Not Assigned",
//             isCancelled: false // Will be updated with cancelled classes later
//           };
//         });
//       }
//     }
    
//     return result;
//   };
  
//   // -----------------------------------------------------
//   // Update timetable data with cancelled classes immediately
//   // -----------------------------------------------------
//   const updateTimetableWithCancelledClasses = (
//     timetable: Record<string, Class[]>, 
//     cancelled: CancelledClass[]
//   ) => {
//     // Create a direct lookup map
//     const cancelledMap: Record<string, boolean> = {};
    
//     cancelled.forEach((cls) => {
//       // Process the API date into local date
//       const apiDate = new Date(cls.date);
//       const year = apiDate.getFullYear();
//       const month = String(apiDate.getMonth() + 1).padStart(2, "0");
//       const day = String(apiDate.getDate()).padStart(2, "0");
//       const dateKey = `${year}-${month}-${day}`;
      
//       // Create multiple lookup keys to handle time format differences
//       const key1 = `${dateKey}|${cls.subject}|${cls.start_time}|${cls.end_time}`;
//       const key2 = `${dateKey}|${cls.subject}|${cls.start_time.substring(0, 5)}|${cls.end_time.substring(0, 5)}`;
      
//       cancelledMap[key1] = true;
//       cancelledMap[key2] = true;
      
//       console.log(`Added cancelled class key: ${key1}`);
//       console.log(`Added cancelled class key: ${key2}`);
//     });

//     // Update all classes in the timetable
//     const updatedTimetable: Record<string, Class[]> = {};
    
//     Object.keys(timetable).forEach((dateKey) => {
//       updatedTimetable[dateKey] = timetable[dateKey].map((cls) => {
//         // Create lookup keys with both full format and shortened format
//         const key1 = `${dateKey}|${cls.subject}|${cls.startTime}|${cls.endTime}`;
//         const key2 = `${dateKey}|${cls.subject}|${cls.startTime.substring(0, 5)}|${cls.endTime.substring(0, 5)}`;
        
//         const isCancelled = cancelledMap[key1] || cancelledMap[key2];
        
//         if (isCancelled) {
//           console.log(`MARKED AS CANCELLED: ${key1}`);
//         }
        
//         return {
//           ...cls,
//           isCancelled: isCancelled
//         };
//       });
//     });

//     setTimetableData(updatedTimetable);
    
//     // Also update the current selected date classes
//     const dateKey = formatDateKey(selectedDate);
//     setClasses(updatedTimetable[dateKey] || []);
//   };

//   // -----------------------------------------------------
//   // Fetch timetable and cancelled classes data
//   // -----------------------------------------------------
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         let token = localStorage.getItem("token") || "";
//         if (!token) {
//           throw new Error("Authentication token not found");
//         }
//         token = "Bearer " + token;
//         const headers = { Authorization: token };

//         // Get timetable data
//         const timetableResponse = await axios.get(
//           "http://localhost:8080/api/v1/student/timetable", 
//           { headers, withCredentials: true }
//         );

//         // Variable to store transformed data that can be used throughout the function
//         let processedTimetableData: Record<string, Class[]> = {};

//         if (timetableResponse.data.success === 200) {
//           processedTimetableData = transformTimetableData(timetableResponse.data.data);
//           setTimetableData(processedTimetableData);
//           console.log("Timetable data:", processedTimetableData);
//         } else {
//           throw new Error(timetableResponse.data.message || "Failed to fetch timetable");
//         }

//         // Get cancelled classes
//         const cancelledClassesResponse = await axios.get(
//           "http://localhost:8080/api/v1/student/cancelled-classes", 
//           { headers, withCredentials: true }
//         );

//         if (cancelledClassesResponse.data.success === 200) {
//           const cancelledData = cancelledClassesResponse.data.data;
//           setCancelledClasses(cancelledData);
//           console.log("Cancelled classes RECEIVED:", cancelledData);
          
//           // Now we can safely use processedTimetableData
//           updateTimetableWithCancelledClasses(processedTimetableData, cancelledData);
//         } else {
//           console.warn("Failed to fetch cancelled classes:", cancelledClassesResponse.data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError(error instanceof Error ? error.message : "An unexpected error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Update classes when selected date or timetable changes
//   useEffect(() => {
//     const dateKey = formatDateKey(selectedDate);
//     setClasses(timetableData[dateKey] || []);
//   }, [selectedDate, timetableData]);

//   // -----------------------------------------------------
//   // Navigation functions
//   // -----------------------------------------------------
//   const prevMonth = () => {
//     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
//   };

//   const nextMonth = () => {
//     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
//   };

//   // -----------------------------------------------------
//   // Calendar grid generation
//   // -----------------------------------------------------
//   const getDaysInMonth = (): CalendarDayInfo[] => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const firstDayOfMonth = new Date(year, month, 1).getDay();
//     const days: CalendarDayInfo[] = [];

//     // Empty cells for days before month starts
//     for (let i = 0; i < firstDayOfMonth; i++) {
//       days.push({ date: null, isCurrentMonth: false });
//     }

//     // Days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month, day);
//       const dateKey = formatDateKey(date);
      
//       // Check if there are any classes/cancelled classes for this day
//       const dayClasses = timetableData[dateKey] || [];
//       const hasCancelledClasses = dayClasses.some(cls => cls.isCancelled);
      
//       days.push({
//         date,
//         isCurrentMonth: true,
//         isToday: isSameDay(date, new Date()),
//         isSelected: isSameDay(date, selectedDate),
//         hasClasses: dayClasses.length > 0,
//         hasCancelledClasses,
//         classCount: dayClasses.length
//       });
//     }
    
//     return days;
//   };

//   // Check if two dates are the same day
//   const isSameDay = (date1: Date, date2: Date): boolean => {
//     return (
//       date1.getFullYear() === date2.getFullYear() &&
//       date1.getMonth() === date2.getMonth() &&
//       date1.getDate() === date2.getDate()
//     );
//   };

//   const days = getDaysInMonth();
//   const selectedDateStr = selectedDate.toLocaleDateString("en-US", {
//     weekday: "short",
//     month: "short",
//     day: "numeric"
//   });

//   // -----------------------------------------------------
//   // Render the Calendar component
//   // -----------------------------------------------------
//   return (
//     <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//       {/* Calendar Header */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-3 py-3">
//         <div className="flex items-center justify-between">
//           <h3 className="font-medium text-gray-900">Academic Schedule</h3>
//           <button
//             onClick={() => setSelectedDate(new Date())}
//             className="text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded-full transition-colors"
//           >
//             Today
//           </button>
//         </div>
//       </div>

//       {/* Calendar Navigation */}
//       <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
//         <h4 className="text-sm font-medium text-gray-700">
//           {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
//         </h4>
//         <div className="flex space-x-1">
//           <button
//             onClick={prevMonth}
//             className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
//             aria-label="Previous month"
//           >
//             <AiOutlineLeft size={14} />
//           </button>
//           <button
//             onClick={nextMonth}
//             className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
//             aria-label="Next month"
//           >
//             <AiOutlineRight size={14} />
//           </button>
//         </div>
//       </div>

//       {/* Mini Calendar Grid */}
//       <div className="px-2 pt-2 pb-3">
//         <div className="grid grid-cols-7 mb-1">
//           {["S", "M", "T", "W", "TH", "F", "SA"].map((day) => (
//             <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
//               {day}
//             </div>
//           ))}
//         </div>
//         <div className="grid grid-cols-7 gap-1">
//           {days.map((day, index) => (
//             <div key={index}>
//               {day.date ? (
//                 <motion.button
//                   whileHover={{ scale: 0.9 }}
//                   whileTap={{ scale: 0.85 }}
//                   onClick={() => setSelectedDate(day.date!)}
//                   className={`w-full aspect-square flex flex-col items-center justify-center rounded-full text-xs relative
//                     ${day.isSelected ? "bg-blue-600 text-white" : day.isToday ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100 text-gray-800"}
//                     ${day.hasClasses && !day.isSelected ? "font-bold" : ""}
//                   `}
//                 >
//                   {day.date.getDate()}
//                   {/* Class indicator dot */}
//                   {day.hasClasses && !day.isSelected && (
//                     <div className="h-1 w-1 rounded-full bg-blue-600 mt-0.5"></div>
//                   )}
//                   {/* Cancelled class indicator */}
//                   {day.hasCancelledClasses && (
//                     <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 border border-white"></div>
//                   )}
//                 </motion.button>
//               ) : (
//                 <div className="w-full aspect-square" />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Classes for the Selected Date */}
//       <div className="border-t border-gray-200 bg-gray-50">
//         <div className="px-3 py-2 flex items-center justify-between">
//           <h4 className="text-xs font-medium text-gray-700">{selectedDateStr}</h4>
//           {!loading && !error && (
//             <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
//               {classes.length}
//             </span>
//           )}
//         </div>
//         <div className="px-3 pb-3">
//           {loading ? (
//             <div className="text-center py-6 text-sm text-gray-500">
//               <div className="animate-pulse flex flex-col items-center">
//                 <div className="h-2 w-24 bg-gray-200 rounded mb-2"></div>
//                 <div className="h-2 w-32 bg-gray-200 rounded"></div>
//               </div>
//               <div className="mt-2">Loading schedule...</div>
//             </div>
//           ) : error ? (
//             <div className="text-center py-4 text-sm">
//               <AiOutlineExclamationCircle size={24} className="mx-auto text-red-500 mb-2" />
//               <div className="text-red-500">{error}</div>
//               <button 
//                 onClick={() => window.location.reload()} 
//                 className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
//               >
//                 Retry
//               </button>
//             </div>
//           ) : (
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={formatDateKey(selectedDate)}
//                 initial={{ opacity: 0, y: 5 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -5 }}
//                 transition={{ duration: 0.15 }}
//                 className="space-y-2"
//               >
//                 {classes.length > 0 ? (
//                   classes.map((cls) => (
//                     <motion.div
//                       key={cls.id}
//                       initial={{ opacity: 0, y: 5 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className={`p-2 rounded border-l-2 ${cls.color} overflow-auto relative ${cls.isCancelled ? "opacity-75" : ""}`}
//                     >
//                       {cls.isCancelled && (
//                         <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-bl-md rounded-tr-md flex items-center">
//                           <AiOutlineClose size={10} className="mr-0.5" />
//                           <span>Cancelled</span>
//                         </div>
//                       )}
//                       <div className={`text-sm font-medium ${cls.isCancelled ? "line-through decoration-red-500" : ""}`}>
//                         {cls.subject}
//                       </div>
//                       <div className="mt-1 space-y-1 text-xs">
//                         <div className="flex items-center text-gray-600">
//                           <AiOutlineClockCircle className="mr-1" size={12} />
//                           <span>{cls.time}</span>
//                         </div>
//                         <div className="flex items-center text-gray-600">
//                           <AiOutlineEnvironment className="mr-1" size={12} />
//                           <span>{cls.room}</span>
//                         </div>
//                         {cls.professor && (
//                           <div className="flex items-center text-gray-600">
//                             <AiOutlineUser className="mr-1" size={12} />
//                             <span>{cls.professor}</span>
//                           </div>
//                         )}
//                       </div>
//                       {cls.isCancelled && (
//                         <div className="mt-1.5 pt-1.5 border-t border-gray-200 text-xs text-red-600">
//                           This class has been cancelled
//                         </div>
//                       )}
//                     </motion.div>
//                   ))
//                 ) : (
//                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-sm text-gray-500">
//                     <div className="mb-1">No classes scheduled</div>
//                     <div className="text-xs">Enjoy your free time</div>
//                   </motion.div>
//                 )}
//               </motion.div>
//             </AnimatePresence>
//           )}
//         </div>
        
//       </div>

//       {/* Global inline styles for custom classes */}
//       <style jsx global>{`
//         .text-xxs {
//           font-size: 0.65rem;
//           line-height: 0.75rem;
//         }
//       `}</style>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";

// -----------------------------------------------------
// Type definitions
// -----------------------------------------------------
type ClassDetails = {
  id?: number;
  subject: string;
  startTime: string;
  endTime: string;
  room: string;
  professor?: string;
  className?: string;
  classId?: number;
  isCancelled?: boolean;
};

type WeekdayTimetable = {
  [key: string]: ClassDetails[];
};

type CancelledClass = {
  date: string;
  subject: string;
  start_time: string;
  end_time: string;
};

type Class = {
  id?: number;
  subject: string;
  startTime: string;
  endTime: string;
  room: string;
  professor?: string;
  className?: string;
  classId?: number;
  color: string;
  isCancelled: boolean;
  time?: string; // For display purposes
};

type CalendarDayInfo = {
  date: Date | null;
  isCurrentMonth: boolean;
  isToday?: boolean;
  isSelected?: boolean;
  hasClasses?: boolean;
  hasCancelledClasses?: boolean;
  classCount?: number;
};

// -----------------------------------------------------
// Helper Functions
// -----------------------------------------------------
const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTime = (timeStr: string): string => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours, 10);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${minutes || "00"} ${period}`;
};

// -----------------------------------------------------
// Main Component
// -----------------------------------------------------
export default function Calendar() {
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [classes, setClasses] = useState<Class[]>([]);
  const [timetableData, setTimetableData] = useState<Record<string, Class[]>>({});
  const [cancelledClasses, setCancelledClasses] = useState<CancelledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'professor' | null>(null);
  
  // Determine user role from localStorage on component mount
  useEffect(() => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role === "student" || role === "professor") {
      setUserRole(role as 'student' | 'professor');
    }
  }, []);
  
  // -----------------------------------------------------
  // Transform timetable API data for students
  // -----------------------------------------------------
  const transformStudentTimetableData = (apiData: WeekdayTimetable): Record<string, Class[]> => {
    const result: Record<string, Class[]> = {};
    
    // Color mapping for subjects
    const subjectColors: Record<string, string> = {};
    const availableColors = [
      "bg-blue-100 border-blue-300 text-blue-800",
      "bg-purple-100 border-purple-300 text-purple-800",
      "bg-emerald-100 border-emerald-300 text-emerald-800",
      "bg-indigo-100 border-indigo-300 text-indigo-800",
      "bg-amber-100 border-amber-300 text-amber-800",
      "bg-rose-100 border-rose-300 text-rose-800",
      "bg-cyan-100 border-cyan-300 text-cyan-800"
    ];
    
    // Day name to number mapping
    const dayMapping: Record<string, number> = {
      "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
      "Thursday": 4, "Friday": 5, "Saturday": 6
    };

    // Process for each day in the current month
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeekNum = date.getDay();
      const dayName = Object.keys(dayMapping).find(
        (key) => dayMapping[key] === dayOfWeekNum
      );

      if (dayName && apiData[dayName]) {
        const dateKey = formatDateKey(date);
        
        result[dateKey] = apiData[dayName].map((cls: ClassDetails, index: number) => {
          if (!subjectColors[cls.subject]) {
            subjectColors[cls.subject] = availableColors[Object.keys(subjectColors).length % availableColors.length];
          }
          
          return {
            subject: cls.subject,
            startTime: cls.startTime,
            endTime: cls.endTime,
            room: cls.room,
            professor: cls.professor,
            color: subjectColors[cls.subject],
            time: `${formatTime(cls.startTime)} - ${formatTime(cls.endTime)}`,
            isCancelled: false // Will be updated later with cancelled classes data
          };
        });
      }
    }
    
    return result;
  };
  
  // -----------------------------------------------------
  // Transform timetable API data for professors
  // -----------------------------------------------------
  const transformProfessorTimetableData = (apiData: WeekdayTimetable): Record<string, Class[]> => {
    const result: Record<string, Class[]> = {};
    
    // Color mapping for subjects and classes
    const classSubjectColors: Record<string, string> = {};
    const availableColors = [
      "bg-blue-100 border-blue-300 text-blue-800",
      "bg-purple-100 border-purple-300 text-purple-800",
      "bg-emerald-100 border-emerald-300 text-emerald-800",
      "bg-indigo-100 border-indigo-300 text-indigo-800",
      "bg-amber-100 border-amber-300 text-amber-800",
      "bg-rose-100 border-rose-300 text-rose-800",
      "bg-cyan-100 border-cyan-300 text-cyan-800"
    ];
    
    // Day name to number mapping
    const dayMapping: Record<string, number> = {
      "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
      "Thursday": 4, "Friday": 5, "Saturday": 6
    };

    // Process for each day in the current month
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeekNum = date.getDay();
      const dayName = Object.keys(dayMapping).find(
        (key) => dayMapping[key] === dayOfWeekNum
      );

      if (dayName && apiData[dayName]) {
        const dateKey = formatDateKey(date);
        
        result[dateKey] = apiData[dayName].map((cls: ClassDetails) => {
          // Create a unique identifier for subject+class combination
          const classSubjectKey = `${cls.subject}-${cls.className}`;
          
          if (!classSubjectColors[classSubjectKey]) {
            classSubjectColors[classSubjectKey] = availableColors[
              Object.keys(classSubjectColors).length % availableColors.length
            ];
          }
          
          return {
            id: cls.id,
            subject: cls.subject,
            startTime: cls.startTime,
            endTime: cls.endTime,
            room: cls.room,
            className: cls.className,
            classId: cls.classId,
            color: classSubjectColors[classSubjectKey],
            time: `${formatTime(cls.startTime)} - ${formatTime(cls.endTime)}`,
            isCancelled: false // Professors don't have cancelled classes in this implementation
          };
        });
      }
    }
    
    return result;
  };
  
  // -----------------------------------------------------
  // Update timetable data with cancelled classes 
  // -----------------------------------------------------
  const updateTimetableWithCancelledClasses = (
    timetable: Record<string, Class[]>, 
    cancelled: CancelledClass[]
  ) => {
    // Create a direct lookup map
    const cancelledMap: Record<string, boolean> = {};
    
    cancelled.forEach((cls) => {
      // Process the API date into local date
      const apiDate = new Date(cls.date);
      const year = apiDate.getFullYear();
      const month = String(apiDate.getMonth() + 1).padStart(2, "0");
      const day = String(apiDate.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;
      
      // Create multiple lookup keys to handle time format differences
      const key1 = `${dateKey}|${cls.subject}|${cls.start_time}|${cls.end_time}`;
      const key2 = `${dateKey}|${cls.subject}|${cls.start_time.substring(0, 5)}|${cls.end_time.substring(0, 5)}`;
      
      cancelledMap[key1] = true;
      cancelledMap[key2] = true;
    });

    // Update all classes in the timetable
    const updatedTimetable: Record<string, Class[]> = {};
    
    Object.keys(timetable).forEach((dateKey) => {
      updatedTimetable[dateKey] = timetable[dateKey].map((cls) => {
        // Create lookup keys with both full format and shortened format
        const key1 = `${dateKey}|${cls.subject}|${cls.startTime}|${cls.endTime}`;
        const key2 = `${dateKey}|${cls.subject}|${cls.startTime.substring(0, 5)}|${cls.endTime.substring(0, 5)}`;
        
        const isCancelled = cancelledMap[key1] || cancelledMap[key2];
        
        return {
          ...cls,
          isCancelled: isCancelled
        };
      });
    });

    setTimetableData(updatedTimetable);
    
    // Also update the current selected date classes
    const dateKey = formatDateKey(selectedDate);
    setClasses(updatedTimetable[dateKey] || []);
  };

  // -----------------------------------------------------
  // Fetch timetable and cancelled classes data
  // -----------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      if (!userRole) return; // Wait until role is determined
      
      setLoading(true);
      setError(null);
      try {
        let token = localStorage.getItem("token") || "";
        if (!token) {
          setError("Authentication token not found");
          setLoading(false);
          return;
        }
        
        token = "Bearer " + token;
        const headers = { Authorization: token };
        let processedTimetableData: Record<string, Class[]> = {};

        // Fetch timetable based on user role
        if (userRole === "student") {
          // Get student timetable
          console.log("huehwgiouhewiuhguwego");
          const timetableResponse = await axios.get(
            "http://localhost:8080/api/v1/student/timetable", 
            { headers, withCredentials: true }
          );
          console.log(timetableResponse);
          if (timetableResponse.data.success === 200) {
            processedTimetableData = transformStudentTimetableData(timetableResponse.data.data);
            
            // Get cancelled classes
            const cancelledClassesResponse = await axios.get(
              "http://localhost:8080/api/v1/student/cancelled-classes", 
              { headers, withCredentials: true }
            );
            
            if (cancelledClassesResponse.data.success === 200) {
              const cancelledClasses = cancelledClassesResponse.data.data;
              setCancelledClasses(cancelledClasses);
              
              // Update timetable with cancelled classes info
              updateTimetableWithCancelledClasses(processedTimetableData, cancelledClasses);
            } else {
              setError("Failed to fetch cancelled classes");
              // Still set the timetable data even if cancelled classes fetch fails
              setTimetableData(processedTimetableData);
            }
          } else {
            setError("Failed to fetch timetable data");
          }
        } else if (userRole === "professor") {
          // Get professor timetable
          const timetableResponse = await axios.get(
            "http://localhost:8080/api/v1/professor/timetable", 
            { headers, withCredentials: true }
          );
          
          if (timetableResponse.data.statusCode === 200) {
            processedTimetableData = transformProfessorTimetableData(timetableResponse.data.data);
            setTimetableData(processedTimetableData);
            
            // Update current day's classes
            const dateKey = formatDateKey(selectedDate);
            setClasses(processedTimetableData[dateKey] || []);
          } else {
            setError("Failed to fetch timetable data");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole, currentMonth]); // Refetch when month changes

  // Update classes when selected date changes
  useEffect(() => {
    const dateKey = formatDateKey(selectedDate);
    setClasses(timetableData[dateKey] || []);
  }, [selectedDate, timetableData]);

  // -----------------------------------------------------
  // Navigation functions
  // -----------------------------------------------------
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // -----------------------------------------------------
  // Calendar grid generation
  // -----------------------------------------------------
  const getDaysInMonth = (): CalendarDayInfo[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days: CalendarDayInfo[] = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ date: null, isCurrentMonth: false });
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = formatDateKey(date);
      
      // Check if there are any classes/cancelled classes for this day
      const dayClasses = timetableData[dateKey] || [];
      const hasCancelledClasses = dayClasses.some(cls => cls.isCancelled);
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, new Date()),
        isSelected: isSameDay(date, selectedDate),
        hasClasses: dayClasses.length > 0,
        hasCancelledClasses,
        classCount: dayClasses.length
      });
    }
    
    return days;
  };

  // Check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const days = getDaysInMonth();
  const monthYear = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  
  const selectedDateStr = selectedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  // -----------------------------------------------------
  // Render the Calendar component
  // -----------------------------------------------------
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg text-gray-800">
            <FaCalendarAlt className="inline mr-2" />
            Class Schedule
          </h2>
          {loading && <span className="text-sm text-blue-600">Loading...</span>}
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-base font-medium text-gray-700">
          {monthYear}
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={prevMonth} 
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
            aria-label="Previous month"
          >
            <FaChevronLeft size={14} />
          </button>
          <button 
            onClick={nextMonth} 
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
            aria-label="Next month"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Mini Calendar Grid */}
      <div className="px-3 pt-2 pb-3">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
            <div key={day} className="text-xs font-medium text-gray-500 text-center py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div 
              key={index}
              onClick={() => day.date && setSelectedDate(day.date)}
              className={`
                relative h-10 rounded-md flex flex-col items-center justify-center
                ${day.isCurrentMonth ? 'cursor-pointer' : 'cursor-default opacity-30'} 
                ${day.isToday ? 'font-bold text-blue-700' : 'text-gray-700'}
                ${day.isSelected ? 'bg-blue-50 border border-blue-300' : ''}
                ${day.isCurrentMonth && !day.isSelected ? 'hover:bg-gray-50' : ''}
              `}
            >
              {day.date?.getDate()}
              
              {/* Indicators for classes */}
              {day.hasClasses && (
                <div className="absolute bottom-1 flex gap-0.5 h-1">
                  {/* Class dot indicator */}
                  <span className={`inline-block h-1 w-1 rounded-full bg-blue-500 ${day.hasCancelledClasses ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                  {/* Show additional dot if there are many classes */}
                  {(day.classCount || 0) > 3 && <span className="inline-block h-1 w-1 rounded-full bg-blue-500"></span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Classes for the Selected Date */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="px-4 py-2 flex items-center justify-between bg-gray-100">
          <h4 className="text-sm font-medium text-gray-700">
            Classes for {selectedDateStr}
          </h4>
          <span className="text-xs text-gray-500">
            {classes.length} {classes.length === 1 ? 'class' : 'classes'}
          </span>
        </div>
        
        {error && (
          <div className="px-4 py-3 text-sm text-red-600 bg-red-50 border-t border-red-100">
            {error}
          </div>
        )}
        
        <div className="px-3 py-2 max-h-[340px] overflow-y-auto">
          {classes.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              No classes scheduled for this day
            </p>
          ) : (
            <div className="space-y-2">
              {classes.map((cls, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-md border text-sm relative ${cls.color} ${
                    cls.isCancelled ? 'opacity-60' : ''
                  }`}
                >
                  {/* Class content */}
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{cls.subject}</span>
                    <span>{cls.time}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-y-1">
                    <span className="w-full text-xs">{cls.room}</span>
                    
                    {/* Different details based on user role */}
                    {userRole === "student" ? (
                      <span className="text-xs">{cls.professor}</span>
                    ) : (
                      <span className="text-xs">Class: {cls.className}</span>
                    )}
                  </div>
                  
                  {/* Cancelled class indicator */}
                  {cls.isCancelled && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* <div className="bg-red-500 h-0.5 w-full absolute transform rotate-[-20deg]"></div> */}
                      <div className="bg-white bg-opacity-70 py-1 px-2 rounded text-xs font-medium text-red-700">
                        CANCELLED
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Global inline styles for custom classes */}
      <style jsx global>{`
        .text-xxs {
          font-size: 0.65rem;
          line-height: 0.75rem;
        }
      `}</style>
    </div>
  );
}