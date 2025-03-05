// import React from 'react'
// import GreetingCardProfessorProfessor from '../components/GreetingCardProfessorProfessor'
// import OverviewGraph from '../components/OverviewGraph'
// import Calender from '../components/Calender'
// import AnnouncementSectionProfessor from '../components/AnnouncementSectionProfessor'
// import HomeworkSectionProfessor from '../components/HomeworkSectionProfessor'

// // interface Announcement {
// //   title: string;
// //   date: string;
// //   content: string;
// //   isImportant: boolean;
// // }

// // interface Homework {
// //   subject: string;
// //   title: string;
// //   dueDate: string;
// //   isCompleted: boolean;
// // }

// function ProfessorDashboard() {
//   return (
//     <div className=" flex flex-col w-full p-2 min-h-screen overflow-auto">
//       {/* <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover -z-10">
//         <source src='/video3.mp4' type="video/mp4" />
//       </video> */}
//       <div className="flex relative z-10">
//         <div className="w-8/12 mr-2">
//           <GreetingCardProfessorProfessor name="Student" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-2">
//           <AnnouncementSectionProfessor announcements={[
//             {
//               title: 'School reopening',
//               date: '10th May 2022',
//               content: 'School will reopen on 10th May 2022. Please make sure you have all the necessary items.',
//               isImportant: true
//             },
//             {
//               title: 'PTA Meeting',
//               date: '12th May 2022',
//               content: 'PTA meeting will be held on 12th May 2022. Please make sure you attend the meeting.',
//               isImportant: false
//             },
//             {
//               title: 'New Admission',
//               date: '15th May 2022',
//               content: 'New admission will be held on 15th May 2022. Please make sure you have all the necessary documents.',
//               isImportant: true
//             }
//           ]} />

// <HomeworkSectionProfessor homeworks={[
//             {
//               subject: 'Mathematics',
//               title: 'Solve the given problems',
//               dueDate: '15th May 2022',
//               isCompleted: false
//             },
//             {
//               subject: 'Science',
//               title: 'Complete the given assignment',
//               dueDate: '20th May 2022',
//               isCompleted: false
//             },
//             {
//               subject: 'English',
//               title: 'Write an essay on your favorite book',
//               dueDate: '25th May 2022',
//               isCompleted: false
//             }
//           ]} />

//   </div>
          
//         </div>
//         <div className="w-4/12 ml-2">
//           <Calender />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfessorDashboard

// import React from 'react'
// import GreetingCardProfessor from '../components/GreetingCardProfessor'
// import OverviewGraph from '../components/OverviewGraph'
// import Calender from '../components/Calender'
// import AnnouncementSectionProfessor from '../components/AnnouncementSectionProfessor'
// import HomeworkSectionProfessor from '../components/HomeworkSectionProfessor'

// function ProfessorDashboard() {
//   return (
//     <div className="flex flex-col w-full p-2 min-h-screen overflow-auto">
//       <div className="flex relative z-10">
//         <div className="w-8/12 mr-2">
//           <GreetingCardProfessor name="Professor" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-2">
//             <AnnouncementSectionProfessor announcements={[
//               {
//                 title: 'End of Semester Exams',
//                 date: '10th May 2023',
//                 content: 'The end of semester examinations will begin from May 20th. The detailed schedule has been posted on the notice board.',
//                 isImportant: true
//               },
//               {
//                 title: 'Faculty Meeting',
//                 date: '12th May 2023',
//                 content: 'All faculty members are required to attend the monthly meeting scheduled for May 15th at 3:00 PM in the conference hall.',
//                 isImportant: true
//               },
//               {
//                 title: 'Research Symposium',
//                 date: '15th May 2023',
//                 content: 'The annual research symposium will be held on June 5th. Faculty members are encouraged to submit their research papers by May 25th.',
//                 isImportant: false
//               },
//               {
//                 title: 'Campus Maintenance',
//                 date: '18th May 2023',
//                 content: 'The west wing of the academic building will be closed for maintenance from May 20th to May 22nd. Classes scheduled in these rooms will be relocated.',
//                 isImportant: false
//               },
//               {
//                 title: 'New Library Resources',
//                 date: '20th May 2023',
//                 content: 'The library has acquired new digital resources for research. A workshop demonstrating how to access these resources will be held on May 25th.',
//                 isImportant: false
//               },
//               {
//                 title: 'Student Counseling Week',
//                 date: '22nd May 2023',
//                 content: 'Next week is designated as Student Counseling Week. All professors are requested to allocate extra office hours for student guidance.',
//                 isImportant: true
//               },
//               {
//                 title: 'Grant Proposal Deadline',
//                 date: '25th May 2023',
//                 content: 'The deadline for submitting research grant proposals to the university committee is June 10th. Early submissions are encouraged.',
//                 isImportant: true
//               }
//             ]} />

//             <HomeworkSectionProfessor homeworks={[
//               {
//                 subject: 'Data Structures',
//                 title: 'Binary Tree Implementation',
//                 dueDate: '15th May 2023',
//                 isCompleted: false
//               },
//               {
//                 subject: 'Algorithms',
//                 title: 'Dynamic Programming Assignment',
//                 dueDate: '18th May 2023',
//                 isCompleted: false
//               },
//               {
//                 subject: 'Database Systems',
//                 title: 'Normalization Practice Problems',
//                 dueDate: '20th May 2023',
//                 isCompleted: false
//               },
//               {
//                 subject: 'Computer Networks',
//                 title: 'Network Protocol Analysis',
//                 dueDate: '22nd May 2023',
//                 isCompleted: false
//               },
//               {
//                 subject: 'Operating Systems',
//                 title: 'Process Synchronization Lab',
//                 dueDate: '25th May 2023',
//                 isCompleted: false
//               },
//               {
//                 subject: 'Web Development',
//                 title: 'Full Stack Project Phase 1',
//                 dueDate: '27th May 2023',
//                 isCompleted: false
//               },
//               {
//                 subject: 'Artificial Intelligence',
//                 title: 'Neural Network Implementation',
//                 dueDate: '30th May 2023',
//                 isCompleted: false
//               }
//             ]} />
//           </div>
          
          
//         </div>
//         <div className="w-4/12 ml-2">
//           <Calender />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfessorDashboard

"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import GreetingCardProfessor from '../components/GreetingCardProfessor'
import Calender from '../components/Calender'
import AnnouncementSectionProfessor from '../components/AnnouncementSectionProfessor'
import HomeworkSectionProfessor from '../components/HomeworkSectionProfessor'

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  class_name: string;
  file_name: string | null;
  file_link: string | null;
  visibility: number;
  class_id: number;
  professor_id: string;
}

interface Homework {
  id: number;
  title: string;
  content: string;
  publishDate: string;
  submissionDate: string;
  className: string;
  totalMarks: number;
  fileLink: string | null;
  fileName: string | null;
}

function ProfessorDashboard() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch data for the dashboard
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch announcements
        const announcementsResponse = await axios.get(
          'http://localhost:8080/api/v1/professor/announcements',
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          }
        );

        // Fetch homework assignments
        const homeworkResponse = await axios.get(
          'http://localhost:8080/api/v1/professor/homework',
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          }
        );

        if (announcementsResponse.data.success) {
          setAnnouncements(announcementsResponse.data.data);
        }

        if (homeworkResponse.data.success) {
          setHomeworks(homeworkResponse.data.data);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  return (
    <div className="flex flex-col w-full p-2 min-h-screen overflow-auto">
      <div className="flex flex-col lg:flex-row relative z-10 gap-4">
        <div className="w-full lg:w-8/12">
          <GreetingCardProfessor />
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-2 mt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            </div>
          ) : error ? (
            <div className="m-2 mt-6 bg-red-50 p-4 rounded-lg border border-red-200 text-center">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 py-1 px-3 rounded"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-2 mt-6">
              <AnnouncementSectionProfessor />
              <HomeworkSectionProfessor />
            </div>
          )}
        </div>
        
        <div className="w-full lg:w-4/12">
          <Calender />
        </div>
      </div>
    </div>
  )
}

export default ProfessorDashboard