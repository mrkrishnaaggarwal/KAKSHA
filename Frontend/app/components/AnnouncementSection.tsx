// <<<<<<< Student-CSS
// import React from "react";
// import Link from "next/link";

// const MAX_CONTENT_LENGTH = 100; // Adjust this value to change truncation length
// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { Bell, ChevronRight, FileText, AlertCircle, RefreshCw } from 'lucide-react';
// >>>>>>> main-save-frontendComplete

// interface Announcement {
//   title: string;
//   date: string;
//   content: string;
//   isImportant?: boolean;
//   class_name?: string;
//   file_name?: string | null;
//   file_link?: string | null;
// }

// interface AnnouncementSectionProps {
//   announcements: Announcement[];
//   loading?: boolean;
//   error?: string | null;
//   onRetry?: () => void;
// }

// <<<<<<< Student-CSS
// function AnnouncementSection({
//   announcements,
//   loading = false,
//   error = null,
// }: AnnouncementSectionProps) {
//   const truncateContent = (content: string) => {
//     if (content.length <= MAX_CONTENT_LENGTH) return content;
//     return content.slice(0, MAX_CONTENT_LENGTH).trim() + "...";
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md p-5 h-full">
//       <div className="flex items-center justify-between mb-5">
//         <h2 className="text-xl font-bold text-gray-800">Announcements</h2>
//         <Link
//           href="/student/announcements"
//           className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1 hover:underline font-medium transition-colors"
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
// =======
// function AnnouncementSection({ 
//   announcements, 
//   loading = false, 
//   error = null,
//   onRetry
// }: AnnouncementSectionProps) {

//   const truncateContent = (content: string, maxLength: number = 100): string => {
//     if (content.length <= maxLength) return content;
//     return content.slice(0, maxLength).trim() + '...';
//   };

//   // Format date function
//   const formatDate = (dateString: string): string => {
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return dateString;
      
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch (e) {
//       return dateString;
//     }
//   };

//   // Check if announcement is important
//   const isAnnouncementImportant = (announcement: Announcement): boolean => {
//     if (announcement.isImportant !== undefined) return announcement.isImportant;
    
//     const lowerTitle = announcement.title.toLowerCase();
//     const lowerContent = announcement.content.toLowerCase();
    
//     return lowerTitle.includes('important') || 
//            lowerTitle.includes('urgent') ||
//            lowerContent.includes('important') ||
//            lowerContent.includes('urgent') ||
//            lowerContent.includes('critical');
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md h-full">
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center">
//           <Bell size={20} className="text-purple-600 mr-2" />
//           <h2 className="text-xl font-semibold text-purple-600 cursor-default">Announcements</h2>
//         </div>
//         <Link 
//           href="/student/announcements" 
//           className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-800"
//         >
//           View All <ChevronRight size={16} />
// >>>>>>> main-save-frontendComplete
//         </Link>
//       </div>

//       {loading ? (
// <<<<<<< Student-CSS
//         <div className="flex justify-center items-center h-60">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
//         </div>
//       ) : error ? (
//         <div className="text-red-500 text-center py-6 bg-red-50 rounded-lg">
//           {error}
//         </div>
//       ) : (
//         <div className="space-y-3 max-h-72 overflow-y-auto pr-1 pt-1">
//           {announcements.map((announcement, index) => (
//             <div
//               key={index}
//               className={`p-4 rounded-lg ${
//                 announcement.isImportant
//                   ? "bg-red-50 border-l-4 border-red-500"
//                   : "bg-gray-50"
//               } transition-all hover:shadow-sm`}
//             >
//               <div className="flex justify-between">
//                 <h3 className="font-semibold text-gray-800">
//                   {announcement.title}
//                 </h3>
//                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
//                   {announcement.date}
//                 </span>
//               </div>
//               <p className="text-sm mt-2 text-gray-600 leading-relaxed">
//                 {truncateContent(announcement.content)}
//               </p>
// =======
//         <div className="flex justify-center items-center h-40">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
//         </div>
//       ) : error ? (
//         <div className="text-center py-6">
//           <p className="text-red-500 mb-2">{error}</p>
//           {onRetry && (
//             <button 
//               onClick={onRetry}
//               className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 py-1 px-3 rounded flex items-center mx-auto"
//             >
//               <RefreshCw size={14} className="mr-1" /> Try Again
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="overflow-y-auto max-h-[500px] pr-2">
//           {announcements.length > 0 ? (
//             announcements.map((announcement, index) => {
//               // Check if the announcement is important
//               const important = isAnnouncementImportant(announcement);
              
//               return (
//                 <div 
//                   key={index}
//                   className={`mb-3 p-4 rounded-lg ${
//                     important
//                       ? 'bg-red-50 border-l-4 border-red-500 shadow-sm' 
//                       : 'bg-gray-50 border border-gray-200 shadow-sm'
//                   }`}
//                 >
//                   <div className="flex justify-between items-start">
//                     <h3 className="font-medium text-gray-800">{announcement.title}</h3>
//                     <div className="text-xs text-gray-500 flex flex-col items-end">
//                       <span>{formatDate(announcement.date)}</span>
//                       {announcement.class_name && (
//                         <span className="mt-1 bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
//                           {announcement.class_name}
//                         </span>
//                       )}
//                     </div>
//                   </div>
                  
//                   <p className="text-sm mt-2 text-gray-700 line-clamp-2">
//                     {truncateContent(announcement.content)}
//                   </p>
                  
//                   {announcement.file_link && (
//                     <div className="mt-2">
//                       <a
//                         href={announcement.file_link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-xs inline-flex items-center text-blue-600 hover:text-blue-800"
//                       >
//                         <FileText size={12} className="mr-1" />
//                         {announcement.file_name || "Download attachment"}
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           ) : (
//             <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
//               <AlertCircle size={32} className="text-gray-400 mx-auto mb-2" />
//               <p className="text-gray-600 font-medium">No announcements available</p>
// >>>>>>> main-save-frontendComplete
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default AnnouncementSection;


"use client";

import React from 'react';
import Link from 'next/link';
import { Bell, ChevronRight, FileText, AlertCircle, RefreshCw } from 'lucide-react';

const MAX_CONTENT_LENGTH = 100; // Adjust this value to change truncation length

interface Announcement {
  title: string;
  date: string;
  content: string;
  isImportant?: boolean;
  class_name?: string;
  file_name?: string | null;
  file_link?: string | null;
}

interface AnnouncementSectionProps {
  announcements: Announcement[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function AnnouncementSection({ 
  announcements, 
  loading = false, 
  error = null,
  onRetry
}: AnnouncementSectionProps) {

  const truncateContent = (content: string, maxLength: number = MAX_CONTENT_LENGTH): string => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trim() + '...';
  };

  // Format date function
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

  // Check if announcement is important
  const isAnnouncementImportant = (announcement: Announcement): boolean => {
    if (announcement.isImportant !== undefined) return announcement.isImportant;
    
    const lowerTitle = announcement.title.toLowerCase();
    const lowerContent = announcement.content.toLowerCase();
    
    return lowerTitle.includes('important') || 
           lowerTitle.includes('urgent') ||
           lowerContent.includes('important') ||
           lowerContent.includes('urgent') ||
           lowerContent.includes('critical');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center">
          <Bell size={20} className="text-purple-600 mr-2" />
          <h2 className="text-xl font-bold text-purple-600">Announcements</h2>
        </div>
        <Link 
          href="/student/announcements" 
          className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-800"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-red-500 mb-2">{error}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 py-1 px-3 rounded flex items-center mx-auto"
            >
              <RefreshCw size={14} className="mr-1" /> Try Again
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 pt-1">
          {announcements.length > 0 ? (
            announcements.map((announcement, index) => {
              // Check if the announcement is important
              const important = isAnnouncementImportant(announcement);
              
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg ${
                    important
                      ? 'bg-red-50 border-l-4 border-red-500 shadow-sm' 
                      : 'bg-gray-50 border border-gray-200 shadow-sm'
                  } transition-all hover:shadow`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
                    <div className="text-xs text-gray-500 flex flex-col items-end">
                      <span>{formatDate(announcement.date)}</span>
                      {announcement.class_name && (
                        <span className="mt-1 bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                          {announcement.class_name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm mt-2 text-gray-700 leading-relaxed line-clamp-2">
                    {truncateContent(announcement.content)}
                  </p>
                  
                  {announcement.file_link && (
                    <div className="mt-2">
                      <a
                        href={announcement.file_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <FileText size={12} className="mr-1" />
                        {announcement.file_name || "Download attachment"}
                      </a>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
              <AlertCircle size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">No announcements available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AnnouncementSection;
