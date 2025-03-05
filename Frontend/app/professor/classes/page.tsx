"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import ClassroomCard from "@/app/components/ClassRoomCard";
import StudentAttendanceModal from "@/app/components/StudentAttendanceModal";
import {
  HiOutlineSearch,
  HiOutlineClipboardCheck,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

// Interfaces for our data types
interface ClassData {
  id: string;
  name: string;
  subjects: string[];
}

interface StudentData {
  id: string;
  name: string;
  rollNo: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
}

interface ApiClassResponse {
  success: number;
  message: string;
  data: Array<{
    id: number;
    name: string;
  }>;
  token: string;
}

interface ApiSubjectsResponse {
  success: number;
  message: string;
  data: {
    subjects: string[];
  };
  token: string;
}

interface ApiAttendanceResponse {
  success: number;
  message: string;
  data: Array<{
    student_id: string;
    roll_no: string;
    first_name: string;
    last_name: string;
    total_classes: string;
    classes_attended: string;
    attendance_percentage: string;
  }>;
  token: string;
}

// Simple API service
const professorApi = {
  // Get all classes for the professor
  getClasses: async (): Promise<{ data: ApiClassResponse }> => {
    const token = localStorage.getItem("token");
    return axios.get("http://localhost:8080/api/v1/professor/classes", {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });
  },
  
  // Get subjects for this professor/class
  getSubjectsForClass: async (classId: string): Promise<{ data: ApiSubjectsResponse }> => {
    const token = localStorage.getItem("token");
    return axios.get(`http://localhost:8080/api/v1/professor/subjects/class/${classId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });
  },

  // Get attendance data - ensure this matches your actual backend route
  getClassAttendance: async (classId: string, subject: string): Promise<{ data: ApiAttendanceResponse }> => {
    const token = localStorage.getItem("token");
    return axios.get(
      `http://localhost:8080/api/v1/professor/attendance/class/${classId}/subject-report?subject=${subject}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials : true
      }
    );
  }
};

export default function ClassesPage() {
  // State with proper type annotations
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStudentsLoading, setIsStudentsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [classSubjectsLoading, setClassSubjectsLoading] = useState<{[key: string]: boolean}>({});
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);
  // Fetch classes when component mounts
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await professorApi.getClasses();
      
      if (response.data.success === 200) {
        // Transform API data and initialize with empty subjects array
        const initialClasses: ClassData[] = response.data.data.map(cls => ({
          id: cls.id.toString(),
          name: cls.name,
          subjects: []
        }));
        
        setClasses(initialClasses);
        
        // Fetch subjects for each class
        initialClasses.forEach(cls => {
          fetchSubjectsForClass(cls.id);
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch classes");
      }
    } catch (error: any) {
      console.error("Error fetching classes:", error);
      setError(error.message || "An error occurred while fetching classes");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubjectsForClass = async (classId: string): Promise<void> => {
    // Set loading state for this class
    setClassSubjectsLoading(prev => ({ ...prev, [classId]: true }));
    
    try {
      const subjectsResponse = await professorApi.getSubjectsForClass(classId);
      
      if (subjectsResponse.data.success === 200) {
        const subjectsList = subjectsResponse.data.data.subjects;
        
        // Update the class with fetched subjects
        setClasses(prevClasses => 
          prevClasses.map(cls => 
            cls.id === classId ? { ...cls, subjects: subjectsList } : cls
          )
        );
      }
    } catch (error) {
      console.error(`Error fetching subjects for class ${classId}:`, error);
    } finally {
      // Clear loading state for this class
      setClassSubjectsLoading(prev => ({ ...prev, [classId]: false }));
    }
  };

  // Filter classes based on search query
  const filteredClasses = searchQuery.trim() 
    ? classes.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : classes;

  const handleSubjectSelect = async (classId: string, subject: string): Promise<void> => {
    setIsStudentsLoading(true);
    setStudentsError(null);
    
    const classData = classes.find(c => c.id === classId);
    if (!classData) return;
    
    setSelectedClass(classData);
    setSelectedSubject(subject);
    setIsModalOpen(true);
    
    try {
      const attendanceResponse = await professorApi.getClassAttendance(classId, subject);
      
      if (attendanceResponse.data.success === 200) {
        const transformedStudents: StudentData[] = attendanceResponse.data.data.map(student => ({
          id: student.student_id,
          name: `${student.first_name} ${student.last_name}`,
          rollNo: student.roll_no,
          totalClasses: parseInt(student.total_classes, 10),
          attendedClasses: parseInt(student.classes_attended, 10),
          attendancePercentage: parseFloat(student.attendance_percentage),
        }));
        
        setStudents(transformedStudents);
      } else {
        throw new Error(attendanceResponse.data.message || "Failed to fetch attendance data");
      }
    } catch (error: any) {
      console.error("Error fetching attendance data:", error);
      setStudentsError(error.message || "An error occurred while loading attendance data");
    } finally {
      setIsStudentsLoading(false);
    }
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setStudents([]);
    setStudentsError(null);
    setSelectedSubject("");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col w-full h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Classes</h1>
          <p className="text-gray-600">
            View attendance reports for your assigned classes
          </p>
        </div>

        {/* Search bar */}
        <div className="flex flex-wrap justify-between items-center mb-8">
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
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading classes...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <HiOutlineExclamationCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              Error Loading Classes
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchClasses}
              className="inline-flex items-center text-white bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded"
            >
              Try Again
            </button>
          </div>
        ) : filteredClasses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <ClassroomCard
                key={classItem.id}
                id={classItem.id}
                subjects={classItem.subjects}
                isLoadingSubjects={!!classSubjectsLoading[classItem.id]}
                classCode={classItem.name}
                section={classItem.name}
                studentsCount={0}
                onSubjectSelect={handleSubjectSelect}
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
              No Classes Available
            </h3>
            <p className="text-gray-600 mb-6">
              You don't have any classes assigned yet
            </p>
          </div>
        )}

        {/* Student attendance modal */}
        {selectedClass && (
          <StudentAttendanceModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            classId={selectedClass.id}
            subject={selectedSubject}
            section={selectedClass.name}
            students={students}
            isLoading={isStudentsLoading}
            error={studentsError}
          />
        )}
      </div>
    </div>
  );
}