import React from "react";
import Link from "next/link";

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

function AnnouncementSection({
  announcements,
  loading = false,
  error = null,
}: AnnouncementSectionProps) {
  const truncateContent = (content: string) => {
    if (content.length <= MAX_CONTENT_LENGTH) return content;
    return content.slice(0, MAX_CONTENT_LENGTH).trim() + "...";
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-800">Announcements</h2>
        <Link
          href="/student/announcements"
          className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1 hover:underline font-medium transition-colors"
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
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-6 bg-red-50 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1 pt-1">
          {announcements.map((announcement, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                announcement.isImportant
                  ? "bg-red-50 border-l-4 border-red-500"
                  : "bg-gray-50"
              } transition-all hover:shadow-sm`}
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-gray-800">
                  {announcement.title}
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {announcement.date}
                </span>
              </div>
              <p className="text-sm mt-2 text-gray-600 leading-relaxed">
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
