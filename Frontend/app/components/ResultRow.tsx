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
  // Calculate percentage for this subject
  const percentage = (obtainedMarks / maxMarks) * 100;
  const isPassed = percentage >= 40;
  
  // Determine grade color and status
  const getGradeColor = () => {
    switch(grade) {
      case 'A': return 'text-green-600 bg-green-50';
      case 'B': return 'text-blue-600 bg-blue-50';
      case 'C': return 'text-yellow-600 bg-yellow-50';
      case 'D': return 'text-orange-600 bg-orange-50';
      default: return 'text-red-600 bg-red-50';
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{code}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{subjectTitle}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{creditPoint}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getGradeColor()}`}>
          {grade}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{obtainedMarks}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{maxMarks}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
          isPassed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {isPassed ? 'Passed' : 'Failed'}
        </span>
      </td>
    </tr>
  );
};

export default ResultRow;