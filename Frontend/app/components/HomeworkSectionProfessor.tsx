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

import React from 'react';
import Link from 'next/link';
import { Book, ChevronRight } from 'lucide-react';
import HomeworkCard from './HomeworkCard';

// Type definitions
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

interface HomeworkSectionProfessorProps {
  homeworks: Homework[];
}

const HomeworkSectionProfessor: React.FC<HomeworkSectionProfessorProps> = ({ homeworks }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <Book size={20} className="text-purple-600 mr-2" />
        <h2 className="text-xl font-semibold text-purple-600">Homework</h2>
      </div>
      <Link href="/homework" className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-800">
        View All <ChevronRight size={16} />
      </Link>
    </div>
    
    <div className="max-h-[70vh] overflow-y-auto pr-2">
      {homeworks.map((homework, index) => (
        <HomeworkCard key={index} {...homework} />
      ))}
      
      {homeworks.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-500">
          No homework assignments to display
        </div>
      )}
    </div>
  </div>
);

export default HomeworkSectionProfessor;