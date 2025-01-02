import React from 'react'
import StudentNavbar from '@/app/components/StudentNavbar'
const layout = ({children} : {children: React.ReactNode}) => {
  return (
    <div className='flex h-full'>
        <StudentNavbar/>
        {children}
    </div>
  )
}

export default layout
