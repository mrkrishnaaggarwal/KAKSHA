// // Example for HomeworkSection.tsx
// import React from "react";
// import Link from "next/link";

// interface Homework {
//   subject: string;
//   title: string;
//   dueDate: string;
//   isCompleted: boolean;
// }

// interface HomeworkSectionProps {
//   homeworks: Homework[];
//   loading?: boolean;
//   error?: string | null;
// }

// function HomeworkSection({
//   homeworks,
//   loading = false,
//   error = null,
// }: HomeworkSectionProps) {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-bold">Homework</h2>
//         <Link
//           href="/student/announcements#homework"
//           className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1 hover:underline"
//         >
//           View all
//           <svg
//             className="w-4 h-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 5l7 7-7 7"
//             />
//           </svg>
//         </Link>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-40">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//         </div>
//       ) : error ? (
//         <div className="text-red-500 text-center py-4">{error}</div>
//       ) : (
//         <div className="space-y-3 max-h-60 overflow-y-auto">
//           {homeworks.map((homework, index) => (
//             <div key={index} className="p-3 bg-gray-50 rounded-md">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 mb-1">
//                     {homework.subject}
//                   </span>
//                   <h3 className="font-medium">{homework.title}</h3>
//                 </div>
//                 <div className="flex flex-col items-end">
//                   <span className="text-xs text-gray-500">
//                     Due: {homework.dueDate}
//                   </span>
//                   <span
//                     className={`text-xs mt-1 ${
//                       homework.isCompleted ? "text-green-500" : "text-amber-500"
//                     }`}
//                   >
//                     {homework.isCompleted ? "Completed" : "Pending"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default HomeworkSection;


"use client";

import React from 'react';
import Link from 'next/link';
import { Book, ChevronRight, Calendar, FileText, AlertCircle, RefreshCw } from 'lucide-react';

interface Homework {
  subject: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
  content?: string;
  fileName?: string | null;
  fileLink?: string | null;
}

interface HomeworkSectionProps {
  homeworks: Homework[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function HomeworkSection({
  homeworks,
  loading = false,
  error = null,
  onRetry
}: HomeworkSectionProps) {
  
  // Calculate days left (if dueDate is a valid date)
  const getDaysLeft = (dueDateString: string): number | null => {
    try {
      const dueDate = new Date(dueDateString);
      if (isNaN(dueDate.getTime())) return null;
      
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (e) {
      return null;
    }
  };

  // Format date for better display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Book size={20} className="text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold text-purple-600 cursor-default">Homework</h2>
        </div>
        <Link
          href="/student/announcements#homework-assignments"
          className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-800"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-red-500 mb-2">{error}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-3 rounded flex items-center mx-auto"
            >
              <RefreshCw size={14} className="mr-1" /> Try Again
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[500px] pr-2">
          {homeworks.length > 0 ? (
            homeworks.map((homework, index) => {
              const daysLeft = getDaysLeft(homework.dueDate);
              
              return (
                <div 
                  key={index} 
                  className="mb-3 p-4 rounded-lg bg-gray-50 border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600 mb-1">
                        {homework.subject}
                      </span>
                      <h3 className="font-medium text-gray-800">{homework.title}</h3>
                    </div>
                    
                    <div className="text-xs text-right">
                      <div className="flex items-center justify-end text-gray-600 mb-1">
                        <Calendar size={12} className="mr-1" />
                        Due: {formatDate(homework.dueDate)}
                      </div>
                      
                      <div className="flex space-x-2 items-center">
                        {daysLeft !== null && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            daysLeft < 0 ? 'bg-red-100 text-red-800' : 
                            daysLeft <= 3 ? 'bg-amber-100 text-amber-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {daysLeft < 0 ? 'Overdue' : 
                            daysLeft === 0 ? 'Due today' : 
                            `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                          </span>
                        )}
                        
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          homework.isCompleted 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}> 
                          {homework.isCompleted ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {homework.content && (
                    <p className="text-sm mt-2 text-gray-600 line-clamp-2">
                      {homework.content}
                    </p>
                  )}
                  
                  {homework.fileLink && (
                    <div className="mt-2">
                      <a
                        href={homework.fileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs inline-flex items-center text-purple-600 hover:text-purple-800"
                      >
                        <FileText size={12} className="mr-1" />
                        {homework.fileName || "Download attachment"}
                      </a>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-500 flex flex-col items-center">
              <AlertCircle size={24} className="text-gray-400 mb-2" />
              <p>No homework assignments available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomeworkSection;