import React from 'react';

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

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ title, date, content, isImportant }) => (
    <div className={`p-4 mb-3 rounded-lg border ${isImportant ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-800">{title}</h3>
        {isImportant && (
          <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
            Important
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-1">{date}</p>
      <p className="text-sm mt-2 text-gray-600">{content}</p>
    </div>
  );

export default AnnouncementCard;