import React from 'react'
import ProfessorNavbar from '@/app/components/ProfessorNavbar'
const layout = ({children} : {children: React.ReactNode}) => {
  return (
    <div className='flex h-full'>
        <ProfessorNavbar/>
        {children}
    </div>
  )
}

export default layout
