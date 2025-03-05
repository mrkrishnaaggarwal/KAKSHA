import AnnouncementBox from '@/app/components/AnnouncementBox'
import React from 'react'
function page() {
  return (
    <div className="flex-1 min-h-screen overflow-auto">
      {/* <Sidebar /> */}
      <div className='w-[100%]'>
        {/* <Topbar /> */}
        <div className='flex'><AnnouncementBox
          classId="class123"
          teacher={{
            name: "Mrs. Johnson",
            avatar: "/teacher-avatar.jpg"
          }}
          actionUrl="/api/announcements"
        />
        </div>
      </div>
    </div>
  )
}

export default page