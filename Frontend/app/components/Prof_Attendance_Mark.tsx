"use client";
import React from 'react';
import { FaSearch, FaFilter, FaTimes, FaUserPlus, FaUserMinus, FaUserClock, FaSave } from 'react-icons/fa';

interface StudentAttendance {
  name: string;
  status: 'Present' | 'Absent' | 'Tardy';
  rollNumber?: string;
}

interface FormProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedFilter: string | null;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string | null>>;
  filteredStudents: StudentAttendance[];
  handleStatusChange: (index: number, status: 'Present' | 'Absent' | 'Tardy') => void;
  handleBulkAction: (status: 'Present' | 'Absent' | 'Tardy') => void;
  handleSave: () => void;
}

const AttendanceForm: React.FC<FormProps> = ({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  filteredStudents,
  handleStatusChange,
  handleBulkAction,
  handleSave
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Search and filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFilter(null)}
              className={`px-3 py-2 rounded-lg border ${
                !selectedFilter
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'border-gray-300 bg-white text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter('Present')}
              className={`px-3 py-2 rounded-lg border flex items-center gap-1 ${
                selectedFilter === 'Present'
                  ? 'bg-green-50 text-green-700 border-green-300'
                  : 'border-gray-300 bg-white text-gray-700'
              }`}
            >
              <FaUserPlus size={14} /> Present
            </button>
            <button
              onClick={() => setSelectedFilter('Absent')}
              className={`px-3 py-2 rounded-lg border flex items-center gap-1 ${
                selectedFilter === 'Absent'
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'border-gray-300 bg-white text-gray-700'
              }`}
            >
              <FaUserMinus size={14} /> Absent
            </button>
            <button
              onClick={() => setSelectedFilter('Tardy')}
              className={`px-3 py-2 rounded-lg border flex items-center gap-1 ${
                selectedFilter === 'Tardy'
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'border-gray-300 bg-white text-gray-700'
              }`}
            >
              <FaUserClock size={14} /> Tardy
            </button>
          </div>
        </div>
      </div>

      {/* Bulk actions */}
      <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
        <div className="text-sm font-medium text-gray-700">
          {filteredStudents.length} students
        </div>
        <div className="flex gap-2 text-sm">
          <span className="mr-1 font-medium text-gray-700">Mark all as:</span>
          <button
            onClick={() => handleBulkAction('Present')}
            className="px-2.5 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center gap-1"
          >
            <FaUserPlus size={12} /> Present
          </button>
          <button
            onClick={() => handleBulkAction('Absent')}
            className="px-2.5 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
          >
            <FaUserMinus size={12} /> Absent
          </button>
          <button
            onClick={() => handleBulkAction('Tardy')}
            className="px-2.5 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1"
          >
            <FaUserClock size={12} /> Tardy
          </button>
        </div>
      </div>

      {/* Student list */}
      <div className="overflow-y-auto max-h-[calc(100vh-380px)]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student, index) => (
              <tr key={student.rollNumber || index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {student.rollNumber || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(index, 'Present')}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${
                        student.status === 'Present'
                          ? 'bg-green-500 text-white'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      <FaUserPlus size={10} /> Present
                    </button>
                    <button
                      onClick={() => handleStatusChange(index, 'Absent')}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${
                        student.status === 'Absent'
                          ? 'bg-red-500 text-white'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      <FaUserMinus size={10} /> Absent
                    </button>
                    <button
                      onClick={() => handleStatusChange(index, 'Tardy')}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${
                        student.status === 'Tardy'
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      <FaUserClock size={10} /> Tardy
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save button */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={handleSave}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
          <FaSave /> Save Attendance
        </button>
      </div>
    </div>
  );
};

export default AttendanceForm;