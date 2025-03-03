"use client";

import { AiFillClockCircle } from "react-icons/ai";

type Homework = {
  id: number;
  title: string;
  author: string;
  timestamp: string;
};

type HomeworkWidgetProps = {
  homeworks: Homework[];
  onViewAll: () => void;
  onSelectHomework: (homeworkId: number) => void;
};

export default function HomeworkWidget({
  homeworks,
  onViewAll,
  onSelectHomework,
}: HomeworkWidgetProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
        <h3 className="font-medium text-gray-900 flex items-center">
          <AiFillClockCircle className="mr-2 text-blue-600" size={18} />
          <span>Homework Due Soon</span>
        </h3>
        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          {homeworks.length}
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {homeworks.map((homework) => (
          <a
            key={homework.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectHomework(homework.id);
            }}
            className="block p-3 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-start">
              <div
                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 mr-2 ${
                  homework.timestamp.includes("tomorrow")
                    ? "bg-red-500"
                    : homework.timestamp.includes("3 days")
                    ? "bg-amber-500"
                    : "bg-green-500"
                }`}
              />
              <div>
                <p className="text-sm font-medium text-gray-800 line-clamp-1">
                  {homework.title}
                </p>
                <div className="flex items-center mt-1">
                  <span
                    className={`text-xs font-medium ${
                      homework.timestamp.includes("tomorrow")
                        ? "text-red-600"
                        : homework.timestamp.includes("3 days")
                        ? "text-amber-600"
                        : "text-green-600"
                    }`}
                  >
                    {homework.timestamp}
                  </span>
                  <span className="mx-1.5 text-gray-300">•</span>
                  <span className="text-xs text-gray-500">
                    {homework.author}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full ${
                      homework.timestamp.includes("tomorrow")
                        ? "bg-red-500 w-[90%]"
                        : homework.timestamp.includes("3 days")
                        ? "bg-amber-500 w-[65%]"
                        : "bg-green-500 w-[40%]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <button
          onClick={onViewAll}
          className="block w-full text-sm text-center text-blue-600 hover:text-blue-800 font-medium"
        >
          View all assignments →
        </button>
      </div>
    </div>
  );
}