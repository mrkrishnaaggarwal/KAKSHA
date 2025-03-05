// Example for HomeworkSection.tsx
import React from "react";
import Link from "next/link";

interface Homework {
  subject: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
}

interface HomeworkSectionProps {
  homeworks: Homework[];
  loading?: boolean;
  error?: string | null;
}

function HomeworkSection({
  homeworks,
  loading = false,
  error = null,
}: HomeworkSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Homework</h2>
        <Link
          href="/student/announcements#homework"
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
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {homeworks.map((homework, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 mb-1">
                    {homework.subject}
                  </span>
                  <h3 className="font-medium">{homework.title}</h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">
                    Due: {homework.dueDate}
                  </span>
                  <span
                    className={`text-xs mt-1 ${
                      homework.isCompleted ? "text-green-500" : "text-amber-500"
                    }`}
                  >
                    {homework.isCompleted ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomeworkSection;
