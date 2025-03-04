import React from 'react';

interface StudentAttendance {
  studentId: string;
  name: string;
  rollNumber: string;
  status: 'Present' | 'Absent' | 'Late';
}

interface AttendanceFormProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilter: string | null;
  setSelectedFilter: (filter: string | null) => void;
  filteredStudents: StudentAttendance[];
  handleStatusChange: (index: number, status: 'Present' | 'Absent' | 'Late') => void;
  handleBulkAction: (status: 'Present' | 'Absent' | 'Late') => void;
  handleSave: () => void;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  filteredStudents,
  handleStatusChange,
  handleBulkAction,
  handleSave,
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Mark Attendance</h2>
      
      {/* Search and Filter */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedFilter(selectedFilter === 'Present' ? null : 'Present')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              selectedFilter === 'Present' 
                ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Present
          </button>
          <button
            onClick={() => setSelectedFilter(selectedFilter === 'Absent' ? null : 'Absent')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              selectedFilter === 'Absent' 
                ? 'bg-red-100 text-red-800 border-2 border-red-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Absent
          </button>
          <button
            onClick={() => setSelectedFilter(selectedFilter === 'Late' ? null : 'Late')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              selectedFilter === 'Late' 
                ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Late
          </button>
        </div>
      </div>
      
      {/* Bulk Actions */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Bulk Actions</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => handleBulkAction('Present')}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
          >
            Mark All Present
          </button>
          <button 
            onClick={() => handleBulkAction('Absent')}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
          >
            Mark All Absent
          </button>
          <button 
            onClick={() => handleBulkAction('Late')}
            className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium"
          >
            Mark All Late
          </button>
        </div>
      </div>
      
      {/* Student List */}
      <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleStatusChange(index, 'Present')}
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          student.status === 'Present' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(index, 'Absent')}
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          student.status === 'Absent' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => handleStatusChange(index, 'Late')}
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          student.status === 'Late' 
                            ? 'bg-yellow-600 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        Late
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  No students found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Save Button */}
      <div className="mt-6">
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          Mark Attendance
        </button>
      </div>
    </div>
  );
};

export default AttendanceForm;