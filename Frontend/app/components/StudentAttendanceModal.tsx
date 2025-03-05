"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  HiOutlineX,
  HiOutlineExclamationCircle,
  HiOutlineRefresh,
} from "react-icons/hi";

interface StudentData {
  id: string;
  name: string;
  rollNo: string;
  attendancePercentage: number;
  totalClasses: number;
  attendedClasses: number;
}

interface StudentAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  subject: string;
  section: string;
  students: StudentData[];
  isLoading?: boolean;
  error?: string | null;
}

const StudentAttendanceModal = ({
  isOpen,
  onClose,
  classId,
  subject,
  section,
  students,
  isLoading = false,
  error = null,
}: StudentAttendanceModalProps) => {
  // Function to determine the color for attendance percentage
  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Dialog Header */}
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-xl font-medium text-gray-900">
                    {section} - {subject} Attendance Report
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                  >
                    <HiOutlineX className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Content based on state */}
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                      <p className="text-gray-600">Loading attendance data...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <HiOutlineExclamationCircle size={40} className="mx-auto text-red-500 mb-3" />
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Error Loading Data</h4>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                      onClick={onClose}
                      className="inline-flex items-center text-white bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded"
                    >
                      <HiOutlineRefresh className="mr-1.5" />
                      Try Again
                    </button>
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No attendance data available for this class and subject.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        Showing attendance report for {students.length} students
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Roll No
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Student Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Classes Attended
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Attendance %
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                                {student.rollNo}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.attendedClasses} / {student.totalClasses}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAttendanceColor(
                                    student.attendancePercentage
                                  )}`}
                                >
                                  {student.attendancePercentage}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default StudentAttendanceModal;