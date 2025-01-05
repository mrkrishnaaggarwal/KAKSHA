import React from 'react';

interface ResultRowProps {
  code: string;
  subjectTitle: string;
  creditPoint: number;
  grade: string;
  obtainedMarks: number;
  maxMarks: number;
}

const ResultRow: React.FC<ResultRowProps> = ({ 
  code, 
  subjectTitle, 
  creditPoint, 
  grade, 
  obtainedMarks, 
  maxMarks 
}) => {
  return (
    <tr>
      <td className="border-b p-2">{code}</td>
      <td className="border-b p-2">{subjectTitle}</td>
      <td className="border-b p-2">{creditPoint}</td>
      <td className="border-b p-2">{grade}</td>
      <td className="border-b p-2">{obtainedMarks}</td>
      <td className="border-b p-2">{maxMarks}</td>
    </tr>
  );
};

export default ResultRow;
