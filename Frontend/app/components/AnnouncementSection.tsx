import React from 'react';
import Link from 'next/link';
import { Calendar, Book, ChevronRight, Bell } from 'lucide-react';
import AnnouncementCard from './AnnouncementCard';

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

const AnnouncementSection: React.FC<AnnouncementsSectionProps> = ({ announcements }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Bell size={20} className="text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold text-purple-600">Announcements</h2>
        </div>
        <Link href="/announcements" className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-800">
          View All <ChevronRight size={16} />
        </Link>
      </div>
      
      <div className="max-h-64 overflow-y-auto pr-2">
        {announcements.map((announcement, index) => (
          <AnnouncementCard key={index} {...announcement} />
        ))}
      </div>
    </div>
  );

export default AnnouncementSection;