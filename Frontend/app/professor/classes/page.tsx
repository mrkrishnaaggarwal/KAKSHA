"use client";

import { useState, useMemo } from "react";
import ClassroomCard from "@/app/components/ClassRoomCard"; // Fixed component name
import StudentAttendanceModal from "@/app/components/StudentAttendanceModal";
import {
  HiOutlinePlus,
  HiOutlineAcademicCap,
  HiOutlineClipboardCheck,
  HiOutlineSearch,
} from "react-icons/hi";

// Add proper TypeScript interfaces
interface ClassData {
  id: string;
  subject: string;
  classCode: string;
  section: string;
  studentsCount: number;
  coverImage?: string;
}

interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "late";
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  attendancePercentage: number;
  attendanceHistory: AttendanceRecord[];
}

// Sample data for classes
const sampleClasses: ClassData[] = [
  {
    id: "class-101",
    subject: "Introduction to Computer Science",
    classCode: "CS101",
    section: "Section A",
    studentsCount: 35,
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
  },
  {
    id: "class-102",
    subject: "Data Structures and Algorithms",
    classCode: "CS201",
    section: "Section B",
    studentsCount: 28,
  },
  {
    id: "class-103",
    subject: "Database Management Systems",
    classCode: "CS301",
    section: "Section A",
    studentsCount: 32,
    coverImage: "https://images.unsplash.com/photo-1489875347897-49f64b51c1f8",
  },
  {
    id: "class-104",
    subject: "Operating Systems",
    classCode: "CS302",
    section: "Section C",
    studentsCount: 25,
  },
  {
    id: "class-105",
    subject: "Computer Networks",
    classCode: "CS403",
    section: "Section A",
    studentsCount: 30,
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
  },
  {
    id: "class-106",
    subject: "Software Engineering",
    classCode: "CS405",
    section: "Section B",
    studentsCount: 22,
  },
];

// Sample student data
const sampleStudents: StudentData[] = [
  {
    id: "student-1",
    name: "John Doe",
    email: "john.doe@university.edu",
    attendancePercentage: 92,
    attendanceHistory: [
      { date: "2025-03-04", status: "present" },
      { date: "2025-03-03", status: "present" },
      { date: "2025-03-02", status: "present" },
      { date: "2025-03-01", status: "absent" },
    ],
  },
  {
    id: "student-2",
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    attendancePercentage: 85,
    attendanceHistory: [
      { date: "2025-03-04", status: "present" },
      { date: "2025-03-03", status: "late" },
      { date: "2025-03-02", status: "present" },
      { date: "2025-03-01", status: "present" },
    ],
  },
  {
    id: "student-3",
    name: "Michael Johnson",
    email: "michael.j@university.edu",
    attendancePercentage: 68,
    attendanceHistory: [
      { date: "2025-03-04", status: "absent" },
      { date: "2025-03-03", status: "present" },
      { date: "2025-03-02", status: "late" },
      { date: "2025-03-01", status: "present" },
    ],
  },
  {
    id: "student-4",
    name: "Emily Williams",
    email: "emily.w@university.edu",
    attendancePercentage: 95,
    attendanceHistory: [
      { date: "2025-03-04", status: "present" },
      { date: "2025-03-03", status: "present" },
      { date: "2025-03-02", status: "present" },
      { date: "2025-03-01", status: "present" },
    ],
  },
  {
    id: "student-5",
    name: "Daniel Brown",
    email: "daniel.b@university.edu",
    attendancePercentage: 73,
    attendanceHistory: [
      { date: "2025-03-04", status: "late" },
      { date: "2025-03-03", status: "absent" },
      { date: "2025-03-02", status: "present" },
      { date: "2025-03-01", status: "present" },
    ],
  },
];

export default function ClassesPage() {
  const [classes] = useState<ClassData[]>(sampleClasses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  // Filter classes based on search query
  const filteredClasses = useMemo(() => {
    if (!searchQuery.trim()) return classes;

    const query = searchQuery.toLowerCase();
    return classes.filter(
      (classItem) =>
        classItem.subject.toLowerCase().includes(query) ||
        classItem.classCode.toLowerCase().includes(query) ||
        classItem.section.toLowerCase().includes(query)
    );
  }, [classes, searchQuery]);

  const handleCardClick = (classId: string) => {
    const classData = classes.find((c) => c.id === classId);
    if (classData) {
      setSelectedClass(classData);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateClass = () => {
    setIsCreatingClass(true);
    // In a real app, this would open a modal or navigate to create class page
    console.log("Creating new class...");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col w-full h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Classes</h1>
          <p className="text-gray-600">
            Manage your classes and track student attendance
          </p>
        </div>

        {/* Actions row */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div className="flex space-x-2 mb-4 sm:mb-0"></div>

          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search classes..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Classes grid */}
        {filteredClasses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <ClassroomCard
                key={classItem.id}
                id={classItem.id}
                subject={classItem.subject}
                classCode={classItem.classCode}
                section={classItem.section}
                studentsCount={classItem.studentsCount}
                coverImage={classItem.coverImage}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <HiOutlineSearch size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No Classes Found
            </h3>
            <p className="text-gray-600 mb-6">
              No classes match your search criteria
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <HiOutlineClipboardCheck
              size={48}
              className="mx-auto text-gray-400 mb-4"
            />
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No Classes Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first class to get started
            </p>
            <button
              onClick={handleCreateClass}
              className="inline-flex items-center text-white bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded"
            >
              <HiOutlinePlus className="mr-1.5" />
              Create Class
            </button>
          </div>
        )}

        {/* Student attendance modal */}
        {selectedClass && (
          <StudentAttendanceModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            classId={selectedClass.id}
            subject={selectedClass.subject}
            section={selectedClass.section}
            students={sampleStudents} // In a real app, you would fetch students for the specific class
          />
        )}
      </div>
    </div>
  );
}
