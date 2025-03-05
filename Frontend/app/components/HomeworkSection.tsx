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
    <div className="bg-white rounded-xl shadow-md p-5 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-800">Homework</h2>
        <Link
          href="/student/announcements#homework"
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
          {homeworks.map((homework, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium mb-2">
                    {homework.subject}
                  </span>
                  <h3 className="font-medium text-gray-800">
                    {homework.title}
                  </h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    Due: {homework.dueDate}
                  </span>
                  <span
                    className={`text-xs mt-2 font-medium px-2 py-1 rounded-full ${
                      homework.isCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
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
