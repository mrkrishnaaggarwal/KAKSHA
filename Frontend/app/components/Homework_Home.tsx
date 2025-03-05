"use client";

import { AiFillClockCircle, AiFillCheckCircle, AiFillWarning } from "react-icons/ai";
import { useMemo } from "react";

interface Homework {
  id: number;
  title: string;
  dueDate: string;
  submitted?: boolean;
  author?: string;
  timestamp?: string;
}

interface HomeworkWidgetProps {
  homeworks: Homework[];
  onViewAll: () => void;
  onSelectHomework: (homeworkId: number) => void;
}

type AssignmentStatus = 'upcoming' | 'due_soon' | 'due_today' | 'overdue' | 'submitted';

export default function HomeworkWidget({
  homeworks,
  onViewAll,
  onSelectHomework,
}: HomeworkWidgetProps) {
  const { activeAssignments, completedCount, overdueCount } = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const processedHomeworks = homeworks.map(homework => {
      const dueDate = new Date(homework.dueDate);
      const dueDateNoTime = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
      
      // Calculate days remaining properly
      const totalMilliseconds = dueDateNoTime.getTime() - today.getTime();
      const daysRemaining = Math.ceil(totalMilliseconds / (1000 * 60 * 60 * 24));
      
      // Determine assignment status
      let status: AssignmentStatus;
      let progressValue: number;
      
      if (homework.submitted) {
        status = 'submitted';
        progressValue = 100;
      } else if (daysRemaining < 0) {
        status = 'overdue';
        progressValue = 100;
      } else if (daysRemaining === 0) {
        status = 'due_today';
        progressValue = 95;
      } else if (daysRemaining <= 2) {
        status = 'due_soon';
        progressValue = 70;
      } else {
        status = 'upcoming';
        // More compact progress formula
        progressValue = Math.max(20, 50 - (daysRemaining - 3) * 3);
      }
      
      // Concise due date text
      let dueText = "";
      if (daysRemaining < 0) {
        dueText = `${Math.abs(daysRemaining)}d overdue`;
      } else if (daysRemaining === 0) {
        dueText = "Today";
      } else if (daysRemaining === 1) {
        dueText = "Tomorrow";
      } else {
        dueText = `${daysRemaining}d`;
      }
      
      return {
        ...homework,
        daysRemaining,
        status,
        progressValue,
        dueText,
        dueDate: dueDateNoTime
      };
    });
    
    // Filter for sidebar-appropriate content
    const activeAssignments = processedHomeworks
      .filter(hw => !hw.submitted && hw.daysRemaining > -7)
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, 5); // Show max 5 items for compact sidebar
    
    const completedCount = processedHomeworks.filter(hw => hw.submitted).length;
    const overdueCount = processedHomeworks.filter(hw => hw.status === 'overdue').length;
    
    return { activeAssignments, completedCount, overdueCount };
  }, [homeworks]);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Compact header with essential info only */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-800 flex items-center">
          <AiFillClockCircle className="text-blue-600 mr-1.5" size={14} />
          <span>Upcoming Work</span>
        </h3>
        <div className="flex items-center gap-1.5">
          {overdueCount > 0 && (
            <span className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
              {overdueCount}
            </span>
          )}
          <span className="bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
            {activeAssignments.length}
          </span>
        </div>
      </div>

      {/* Compact assignment list */}
      <div className="divide-y divide-gray-100 max-h-[250px] overflow-auto">
        {activeAssignments.length > 0 ? (
          activeAssignments.map((homework) => (
            <button
              key={homework.id}
              onClick={() => onSelectHomework(homework.id)}
              className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors flex items-start"
            >
              {/* Compact status indicator */}
              <div 
                className={`w-2 h-2 mt-1.5 mr-2 flex-shrink-0 rounded-full ${
                  homework.status === 'overdue' || homework.status === 'due_today'
                    ? "bg-red-500"
                    : homework.status === 'due_soon'
                    ? "bg-amber-500"
                    : "bg-green-500"
                } ${homework.status === 'overdue' || homework.status === 'due_today' ? 'animate-pulse' : ''}`}
              />
              
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">
                  {homework.title}
                </p>
                
                {/* Compact metadata */}
                <div className="flex items-center mt-1">
                  <span
                    className={`text-xs font-medium ${
                      homework.status === 'overdue' || homework.status === 'due_today'
                        ? "text-red-600"
                        : homework.status === 'due_soon'
                        ? "text-amber-600"
                        : "text-green-600"
                    }`}
                  >
                    {homework.dueText}
                  </span>
                  
                  {homework.author && (
                    <span className="text-xs text-gray-500 ml-auto truncate max-w-[60%]">
                      {homework.author.split(' ')[0]}
                    </span>
                  )}
                </div>

                {/* Thin progress bar for compact design */}
                <div className="w-full bg-gray-100 rounded-full h-1 mt-1.5">
                  <div
                    className={`h-1 rounded-full ${
                      homework.status === 'overdue' || homework.status === 'due_today'
                        ? "bg-red-500"
                        : homework.status === 'due_soon'
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${homework.progressValue}%` }}
                  ></div>
                </div>
              </div>
            </button>
          ))
        ) : (
          /* Compact empty state */
          <div className="py-6 px-4 text-center">
            <AiFillCheckCircle className="text-blue-400 text-xl mx-auto mb-2" />
            <p className="text-xs text-gray-600">
              {completedCount > 0 
                ? "All work completed" 
                : "No assignments due"}
            </p>
          </div>
        )}
      </div>

      {/* Minimal footer */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
        <button
          onClick={onViewAll}
          className="w-full text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1.5"
        >
          View all
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}