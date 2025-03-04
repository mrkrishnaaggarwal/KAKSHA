import React from 'react';
import ResultRow from '@/app/components/ResultRow';
import { CheckCircle, AlertCircle, Award } from 'lucide-react';

interface Result {
  code: string;
  subjectTitle: string;
  creditPoint: number;
  grade: string;
  obtainedMarks: number;
  maxMarks: number;
}

interface ResultCardProps {
  results: Result[];
}

const ResultCard: React.FC<ResultCardProps> = ({ results }) => {
  // Calculate total marks and grade statistics
  const totalObtainedMarks = results.reduce((sum, item) => sum + item.obtainedMarks, 0);
  const totalMaxMarks = results.reduce((sum, item) => sum + item.maxMarks, 0);
  const percentage = (totalObtainedMarks / totalMaxMarks) * 100;
  
  // Determine overall result status
  const isPassed = percentage >= 40;
  const gradeDistribution = results.reduce((acc, item) => {
    acc[item.grade] = (acc[item.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div className="space-y-6">
      {/* Subject Results Cards */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Subject Results</h3>
            <span className="text-sm text-gray-500">{results.length} subjects</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Max</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map((result, index) => (
                <ResultRow
                  key={index}
                  code={result.code}
                  subjectTitle={result.subjectTitle}
                  creditPoint={result.creditPoint}
                  grade={result.grade}
                  obtainedMarks={result.obtainedMarks}
                  maxMarks={result.maxMarks}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Result Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Result Summary</h3>
          
          <div className="flex items-center mb-6">
            {isPassed ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Passed</span>
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Failed</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Marks</span>
              <span className="font-medium">{totalObtainedMarks}/{totalMaxMarks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Percentage</span>
              <span className="font-medium">{percentage.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Result Status</span>
              <span className={`font-medium ${isPassed ? 'text-green-600' : 'text-red-500'}`}>
                {isPassed ? 'Pass' : 'Fail'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Performance Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">Performance</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  grade === 'A' ? 'bg-green-100 text-green-600' :
                  grade === 'B' ? 'bg-blue-100 text-blue-600' :
                  grade === 'C' ? 'bg-yellow-100 text-yellow-600' :
                  grade === 'D' ? 'bg-orange-100 text-orange-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {grade}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grade {grade}</span>
                    <span className="text-gray-800">{count} {count === 1 ? 'subject' : 'subjects'}</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        grade === 'A' ? 'bg-green-500' :
                        grade === 'B' ? 'bg-blue-500' :
                        grade === 'C' ? 'bg-yellow-500' :
                        grade === 'D' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(count / results.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;