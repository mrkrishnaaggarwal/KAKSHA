'use client';

import React, { useState } from 'react';
// import StudentSidebar from '@/app/components/StudentNavbar';
import Topbar from '@/app/components/StudentTopbar';
import ResultCard from '@/app/components/ResultCard';

const Results = () => {
  // Static data for results
  const staticData = [
    {
      code: 'ENG252',
      subjectTitle: 'English',
      creditPoint: 4.5,
      grade: 'A',
      obtainedMarks: 85,
      maxMarks: 100,
    },
    {
      code: 'PHY252',
      subjectTitle: 'Physics',
      creditPoint: 4.0,
      grade: 'B',
      obtainedMarks: 75,
      maxMarks: 100,
    },
    {
      code: 'MAIC252',
      subjectTitle: 'Mathematics',
      creditPoint: 4.5,
      grade: 'A',
      obtainedMarks: 90,
      maxMarks: 100,
    },
  ];

  // State to manage results
  const [result, setResult] = useState(staticData);

  return (
    <div className="flex w-screen h-screen">
      <div className="w-[85%]">
        {/* Topbar */}
        <Topbar
        name="John Doe"
        profilePic="/path/to/profile-pic.jpg" 
        details={[
          { label: 'Role', value: 'Student' },
          { label: 'ID', value: '123456' },
        ]}
      />

        <div className="flex flex-col mt-4">
          {/* Header Section */}
          <div className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Annual Exam Results</h2>
            <div className="flex space-x-4">
              {/* Dropdown to Select Exams */}
              <select
                className="p-2 rounded-lg border border-gray-300"
                onChange={(e) => {
                  // Add logic for selecting the exam
                  console.log('Selected exam:', e.target.value);
                }}
              >
                <option value="exam1">Mid-Term Examination</option>
                <option value="exam2">Final Examination</option>
                <option value="exam3">Quarterly Examination</option>
              </select>

              {/* Download Button */}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={() => {
                  // Add logic for downloading marksheet
                  console.log('Download button clicked');
                }}
              >
                Download Marksheet
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="w-full mt-4">
            <ResultCard results={result} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
