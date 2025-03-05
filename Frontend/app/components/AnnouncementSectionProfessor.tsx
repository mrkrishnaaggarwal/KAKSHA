// import React from 'react';
// import Link from 'next/link';
// import { Calendar, Book, ChevronRight, Bell } from 'lucide-react';
// import AnnouncementCard from './AnnouncementCard';

// interface Announcement {
//     title: string;
//     date: string;
//     content: string;
//     isImportant: boolean;
//   }
  
//   interface Homework {
//     subject: string;
//     title: string;
//     dueDate: string;
//     isCompleted: boolean;
//   }
  
//   interface AnnouncementCardProps extends Announcement {}
  
//   interface HomeworkCardProps extends Homework {}
  
//   interface AnnouncementsSectionProps {
//     announcements: Announcement[];
//   }
  
//   interface HomeworkSectionProps {
//     homeworks: Homework[];
//   }

// const AnnouncementSectionProfessor: React.FC<AnnouncementsSectionProps> = ({ announcements }) => (
//     <div className="bg-white p-6 rounded-lg shadow-sm h-full">
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center">
//           <Bell size={20} className="text-purple-600 mr-2" />
//           <h2 className="text-xl font-semibold text-purple-600">Announcements</h2>
//         </div>
//         <Link href="/announcements" className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-800">
//           View All <ChevronRight size={16} />
//         </Link>
//       </div>
      
//       <div className="max-h-64 overflow-y-auto pr-2">
//         {announcements.map((announcement, index) => (
//           <AnnouncementCard key={index} {...announcement} />
//         ))}
//       </div>
//     </div>
//   );

// export default AnnouncementSectionProfessor;

// import React from 'react';
// import Link from 'next/link';
// import { ChevronRight, Bell } from 'lucide-react';
// import AnnouncementCard from './AnnouncementCard';

// interface Announcement {
//   title: string;
//   date: string;
//   content: string;
//   isImportant: boolean;
// }

// interface Homework {
//   subject: string;
//   title: string;
//   dueDate: string;
//   isCompleted: boolean;
// }

// interface AnnouncementCardProps extends Announcement {}

// interface HomeworkCardProps extends Homework {}

// interface AnnouncementsSectionProps {
//   announcements: Announcement[];
// }

// interface HomeworkSectionProps {
//   homeworks: Homework[];
// }

// const AnnouncementSectionProfessor: React.FC<AnnouncementsSectionProps> = ({ announcements }) => (
//   <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
//     <div className="flex justify-between items-center mb-4">
//       <div className="flex items-center">
//         <Bell size={20} className="text-purple-600 mr-2" />
//         <h2 className="text-xl font-semibold text-purple-600">Announcements</h2>
//       </div>
//       <Link href="/announcements" className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-800">
//         View All <ChevronRight size={16} />
//       </Link>
//     </div>
    
//     <div className="max-h-[70vh] overflow-y-auto pr-2">
//       {announcements.map((announcement, index) => (
//         <AnnouncementCard key={index} {...announcement} />
//       ))}
      
//       {announcements.length === 0 && (
//         <div className="flex items-center justify-center h-full text-gray-500">
//           No announcements to display
//         </div>
//       )}
//     </div>
//   </div>
// );

// export default AnnouncementSectionProfessor;

"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Bell, ChevronRight, FileText } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  class_id: number;
  class_name: string;
  file_name: string | null;
  file_link: string | null;
  visibility: number;
  professor_id: string;
}

const AnnouncementSectionProfessor: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:8080/api/v1/professor/announcements', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      if (response.data.success) {
        setAnnouncements(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if announcement is important
  const isAnnouncementImportant = (announcement: Announcement): boolean => {
    return announcement.title.toLowerCase().includes('important') || 
           announcement.content.toLowerCase().includes('urgent') ||
           announcement.content.toLowerCase().includes('important');
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 100): string => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center mb-4 ">
        <div className="flex items-center">
          <Bell size={20} className="text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold text-purple-600 cursor-default">Your Announcements</h2>
        </div>
        <Link href="/professor/announcement" className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-800">
          Manage <ChevronRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            onClick={fetchAnnouncements}
            className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 py-1 px-3 rounded"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[500px] pr-2">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div 
                key={announcement.id}
                className={`mb-3 p-4 rounded-lg ${
                  isAnnouncementImportant(announcement) 
                    ? 'bg-red-50 border-l-4 border-red-500' 
                    : 'bg-gray-50'
                }`}
              >
                {/* <div className="mt-1 w-fit mb-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {announcement.class_name}
                </div> */}
                <div className="min-w-fit text-xs text-gray-500 flex justify-between items-center">
                  <span className="mt-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                    {announcement.class_name}
                  </span>
                  <span>{formatDate(announcement.date)}</span>
                </div>

                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">{announcement.title}</h3>
                </div>
                
                <p className="text-sm mt-2 text-gray-600 line-clamp-2">
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
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              No announcements available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnnouncementSectionProfessor;