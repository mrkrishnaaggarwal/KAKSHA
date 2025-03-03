import React from 'react';
import { Calendar, Book, ChevronRight, Bell } from 'lucide-react';

interface Announcement {
    title: string;
    date: string;
    content: string;
    isImportant: boolean;
  }
  
  interface Homework {
    subject: string;
    title: string;
    dueDate: string;
    isCompleted: boolean;
  }
  
  interface AnnouncementCardProps extends Announcement {}
  
  interface HomeworkCardProps extends Homework {}
  
  interface AnnouncementsSectionProps {
    announcements: Announcement[];
  }
  
  interface HomeworkSectionProps {
    homeworks: Homework[];
  }

const HomeworkCard: React.FC<HomeworkCardProps> = ({ subject, title, dueDate, isCompleted }) => (
    <div className={`p-4 mb-3 rounded-lg border ${isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-purple-600">{subject}</span>
        {isCompleted ? (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Completed
          </span>
        ) : (
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            Due Soon
          </span>
        )}
      </div>
      <h3 className="font-medium text-gray-800 mt-1">{title}</h3>
      <div className="flex items-center mt-2 text-sm text-gray-600">
        <Calendar size={14} className="mr-1" />
        <span>Due: {dueDate}</span>
      </div>
    </div>
  );

export default HomeworkCard;