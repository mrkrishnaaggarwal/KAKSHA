import React from 'react'
import GreetingCard from '../components/GreetingCard'
import AttendanceAndExamscore from '../components/AttendanceAndExamscore'
import OverviewGraph from '../components/OverviewGraph'
import Calender from '../components/Calender'
function StudentDashboard() {
  return (
    <div className="w-full p-2 relative">
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover -z-10">
        <source src='/video3.mp4' type="video/mp4" />
      </video>
      <div className="flex relative z-10">
        <div className="w-8/12 mr-2">
          <GreetingCard name="Student" />
          <AttendanceAndExamscore />
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