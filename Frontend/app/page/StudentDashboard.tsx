import React from 'react'
import GreetingCard from '../components/GreetingCard'
import AttendanceAndExamscore from '../components/AttendanceAndExamscore'
import OverviewGraph from '../components/OverviewGraph'
import Calender from '../components/Calender'
import AnnouncementSection from '../components/AnnouncementSection'
import HomeworkSection from '../components/HomeworkSection'

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

function StudentDashboard() {
  return (
    <div className=" flex flex-col w-full p-2 min-h-screen overflow-auto">
      {/* <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover -z-10">
        <source src='/video3.mp4' type="video/mp4" />
      </video> */}
      <div className="flex relative z-10">
        <div className="w-8/12 mr-2">
          <GreetingCard name="Student" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-2">
          <AnnouncementSection announcements={[
            {
              title: 'School reopening',
              date: '10th May 2022',
              content: 'School will reopen on 10th May 2022. Please make sure you have all the necessary items.',
              isImportant: true
            },
            {
              title: 'PTA Meeting',
              date: '12th May 2022',
              content: 'PTA meeting will be held on 12th May 2022. Please make sure you attend the meeting.',
              isImportant: false
            },
            {
              title: 'New Admission',
              date: '15th May 2022',
              content: 'New admission will be held on 15th May 2022. Please make sure you have all the necessary documents.',
              isImportant: true
            }
          ]} />

<HomeworkSection homeworks={[
            {
              subject: 'Mathematics',
              title: 'Solve the given problems',
              dueDate: '15th May 2022',
              isCompleted: false
            },
            {
              subject: 'Science',
              title: 'Complete the given assignment',
              dueDate: '20th May 2022',
              isCompleted: false
            },
            {
              subject: 'English',
              title: 'Write an essay on your favorite book',
              dueDate: '25th May 2022',
              isCompleted: false
            }
          ]} />

  </div>
          
          <OverviewGraph />
        </div>
        <div className="w-4/12 ml-2">
          <Calender />
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard