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

import React from 'react'
import GreetingCardProfessor from '../components/GreetingCardProfessor'
import OverviewGraph from '../components/OverviewGraph'
import Calender from '../components/Calender'
import AnnouncementSectionProfessor from '../components/AnnouncementSectionProfessor'
import HomeworkSectionProfessor from '../components/HomeworkSectionProfessor'

function ProfessorDashboard() {
  return (
    <div className="flex flex-col w-full p-2 min-h-screen overflow-auto">
      <div className="flex relative z-10">
        <div className="w-8/12 mr-2">
          <GreetingCardProfessor name="Professor" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-2">
            <AnnouncementSectionProfessor announcements={[
              {
                title: 'End of Semester Exams',
                date: '10th May 2023',
                content: 'The end of semester examinations will begin from May 20th. The detailed schedule has been posted on the notice board.',
                isImportant: true
              },
              {
                title: 'Faculty Meeting',
                date: '12th May 2023',
                content: 'All faculty members are required to attend the monthly meeting scheduled for May 15th at 3:00 PM in the conference hall.',
                isImportant: true
              },
              {
                title: 'Research Symposium',
                date: '15th May 2023',
                content: 'The annual research symposium will be held on June 5th. Faculty members are encouraged to submit their research papers by May 25th.',
                isImportant: false
              },
              {
                title: 'Campus Maintenance',
                date: '18th May 2023',
                content: 'The west wing of the academic building will be closed for maintenance from May 20th to May 22nd. Classes scheduled in these rooms will be relocated.',
                isImportant: false
              },
              {
                title: 'New Library Resources',
                date: '20th May 2023',
                content: 'The library has acquired new digital resources for research. A workshop demonstrating how to access these resources will be held on May 25th.',
                isImportant: false
              },
              {
                title: 'Student Counseling Week',
                date: '22nd May 2023',
                content: 'Next week is designated as Student Counseling Week. All professors are requested to allocate extra office hours for student guidance.',
                isImportant: true
              },
              {
                title: 'Grant Proposal Deadline',
                date: '25th May 2023',
                content: 'The deadline for submitting research grant proposals to the university committee is June 10th. Early submissions are encouraged.',
                isImportant: true
              }
            ]} />

            <HomeworkSectionProfessor homeworks={[
              {
                subject: 'Data Structures',
                title: 'Binary Tree Implementation',
                dueDate: '15th May 2023',
                isCompleted: false
              },
              {
                subject: 'Algorithms',
                title: 'Dynamic Programming Assignment',
                dueDate: '18th May 2023',
                isCompleted: false
              },
              {
                subject: 'Database Systems',
                title: 'Normalization Practice Problems',
                dueDate: '20th May 2023',
                isCompleted: false
              },
              {
                subject: 'Computer Networks',
                title: 'Network Protocol Analysis',
                dueDate: '22nd May 2023',
                isCompleted: false
              },
              {
                subject: 'Operating Systems',
                title: 'Process Synchronization Lab',
                dueDate: '25th May 2023',
                isCompleted: false
              },
              {
                subject: 'Web Development',
                title: 'Full Stack Project Phase 1',
                dueDate: '27th May 2023',
                isCompleted: false
              },
              {
                subject: 'Artificial Intelligence',
                title: 'Neural Network Implementation',
                dueDate: '30th May 2023',
                isCompleted: false
              }
            ]} />
          </div>
          
          
        </div>
        <div className="w-4/12 ml-2">
          <Calender />
        </div>
      </div>
    </div>
  )
}

export default ProfessorDashboard