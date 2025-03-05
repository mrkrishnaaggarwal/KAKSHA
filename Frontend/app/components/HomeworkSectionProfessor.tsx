// import React from 'react';
// import Link from 'next/link';
// import { Calendar, Book, ChevronRight, Bell } from 'lucide-react';
// import HomeworkCard from './HomeworkCard';

// // Type definitions
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

// interface HomeworkSectionProfessorProps {
//   homeworks: Homework[];
// }

// const HomeworkSectionProfessor: React.FC<HomeworkSectionProfessorProps> = ({ homeworks }) => (
//     <div className="bg-white p-6 rounded-lg shadow-sm h-full">
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center">
//           <Book size={20} className="text-purple-600 mr-2" />
//           <h2 className="text-xl font-semibold text-purple-600">Homework</h2>
//         </div>
//         <Link href="/homework" className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-800">
//           View All <ChevronRight size={16} />
//         </Link>
//       </div>
      
//       <div className="max-h-64 overflow-y-auto pr-2">
//         {homeworks.map((homework, index) => (
//           <HomeworkCard key={index} {...homework} />
//         ))}
//       </div>
//     </div>
//   );

// export default HomeworkSectionProfessor;

// import React from 'react';
// import Link from 'next/link';
// import { Book, ChevronRight } from 'lucide-react';
// import HomeworkCard from './HomeworkCard';

// // Type definitions
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

// interface HomeworkSectionProfessorProps {
//   homeworks: Homework[];
// }

// const HomeworkSectionProfessor: React.FC<HomeworkSectionProfessorProps> = ({ homeworks }) => (
//   <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
//     <div className="flex justify-between items-center mb-4">
//       <div className="flex items-center">
//         <Book size={20} className="text-purple-600 mr-2" />
//         <h2 className="text-xl font-semibold text-purple-600">Homework</h2>
//       </div>
//       <Link href="/homework" className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-800">
//         View All <ChevronRight size={16} />
//       </Link>
//     </div>
    
//     <div className="max-h-[70vh] overflow-y-auto pr-2">
//       {homeworks.map((homework, index) => (
//         <HomeworkCard key={index} {...homework} />
//       ))}
      
//       {homeworks.length === 0 && (
//         <div className="flex items-center justify-center h-full text-gray-500">
//           No homework assignments to display
//         </div>
//       )}
//     </div>
//   </div>
// );

// export default HomeworkSectionProfessor;

"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Book, ChevronRight, Calendar, FileText } from 'lucide-react';

interface Homework {
  id: number;
  title: string;
  content: string;
  publishDate: string;
  submissionDate: string;
  className: string;
  totalMarks: number;
  fileLink: string | null;
  fileName: string | null;
}

const HomeworkSectionProfessor: React.FC = () => {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const fetchHomeworks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:8080/api/v1/professor/homework', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      if (response.data.success) {
        setHomeworks(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching homework assignments:', err);
      setError('Failed to fetch homework assignments');
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

  // Calculate days left for submission
  const getDaysLeft = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Book size={20} className="text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold text-purple-600 cursor-default">Assigned Homework</h2>
        </div>
        <Link href="/professor/announcement#homework-assignments" className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-800">
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
            onClick={fetchHomeworks}
            className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 py-1 px-3 rounded"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[500px] pr-2">
          {homeworks.length > 0 ? (
            homeworks.map((homework) => {
              const daysLeft = getDaysLeft(homework.submissionDate);
              
              return (
                <div 
                  key={homework.id}
                  className="mb-4 p-3 rounded-lg bg-gray-50 border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 mb-1">
                        {homework.className}
                      </span>
                      <h3 className="font-medium text-gray-800">{homework.title}</h3>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      <div className="flex items-center justify-end">
                        <Calendar size={12} className="mr-1" />
                        <span>Due: {formatDate(homework.submissionDate)}</span>
                      </div>
                      <span className={`mt-1 inline-block px-2 py-0.5 rounded-full ${
                        daysLeft < 0 ? 'bg-red-100 text-red-800' : 
                        daysLeft <= 3 ? 'bg-amber-100 text-amber-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {daysLeft < 0 ? 'Overdue' : 
                         daysLeft === 0 ? 'Due today' : 
                         `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm mt-2 text-gray-600 line-clamp-2">
                    {homework.content}
                  </p>
                  
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Max marks:</span> {homework.totalMarks}
                    </div>
                    
                    {homework.fileLink && (
                      <a 
                        href={homework.fileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <FileText size={12} className="mr-1" />
                        {homework.fileName || "View attachment"}
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-500">
              No homework assignments available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeworkSectionProfessor;