import React from 'react';
import Link from 'next/link';

const MAX_CONTENT_LENGTH = 100; // Adjust this value to change truncation length


interface Announcement {
  title: string;
  date: string;
  content: string;
  isImportant: boolean;
}

interface AnnouncementSectionProps {
  announcements: Announcement[];
  loading?: boolean;
  error?: string | null;
}

function AnnouncementSection({ announcements, loading = false, error = null }: AnnouncementSectionProps) {

  const truncateContent = (content: string) => {
    if (content.length <= MAX_CONTENT_LENGTH) return content;
    return content.slice(0, MAX_CONTENT_LENGTH).trim() + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Announcements</h2>
        <Link 
          href="/student/announcements" 
          className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1 hover:underline"
        >
          View all
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {announcements.map((announcement, index) => (
            <div key={index} className={`p-3 rounded-md ${announcement.isImportant ? 'bg-red-50 border-l-4 border-red-500' : 'bg-gray-50'}`}>
              <div className="flex justify-between">
                <h3 className="font-medium">{announcement.title}</h3>
                <span className="text-xs text-gray-500">{announcement.date}</span>
              </div>
              <p className="text-sm mt-1 text-gray-600">
                {truncateContent(announcement.content)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AnnouncementSection;