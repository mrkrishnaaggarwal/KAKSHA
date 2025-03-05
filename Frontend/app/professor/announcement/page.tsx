"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Announcement_Card from "@/app/components/Anouncement_Card";
import Prof_Homework_Card from "@/app/components/Prof_Homework_Card";
import AnnouncementBox from "@/app/components/AnnouncementBox";
import Link from "next/link";

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  class_id: number;
  class_name: string;
  file_name: string | null;
  file_link: string | null;
  visibility: number;
  professor_id: string;
}

interface Homework {
  id: number;
  title: string;
  content: string;
  publishDate: string;
  submissionDate: string;
  className: string;
  totalMarks: number;
  fileLink: string | null;
  fileName: string | null;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  
  // Add this function to scroll to the section based on hash
  const scrollToSection = () => {
    // Get the hash from the URL (e.g., #homework-assignments)
    const hash = window.location.hash;
    
    if (hash && !loading) {
      // Remove the # character
      const id = hash.replace('#', '');
      
      // Find the element and scroll to it
      const element = document.getElementById(id);
      if (element) {
        // Add a small delay to ensure the element is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };
  
  // Add this effect to handle URL hash changes
  useEffect(() => {
    // Listen for hash changes
    window.addEventListener('hashchange', scrollToSection);
    
    // Initial check for hash when component mounts
    scrollToSection();
    
    // Cleanup
    return () => {
      window.removeEventListener('hashchange', scrollToSection);
    };
  }, [loading]); // Re-run when loading state changes
  
  useEffect(() => {
    // Check for authentication token
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Fetch data from APIs
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch announcements
        const announcementsResponse = await axios.get(
          'http://localhost:8080/api/v1/professor/announcements',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );
        
        // Fetch homeworks
        const homeworksResponse = await axios.get(
          'http://localhost:8080/api/v1/professor/homework',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );
        
        // Update state with fetched data
        setAnnouncements(announcementsResponse.data.data || []);
        setHomeworks(homeworksResponse.data.data || []);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        
        // Handle unauthorized error (token expired/invalid)
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
        // Check for hash after data is loaded
        setTimeout(scrollToSection, 100);
      }
    };
    
    fetchData();
  }, [router]);
  
  const handleViewAllHomework = () => {
    // Scroll to homework section
    document.getElementById("homework-assignments")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleSelectHomework = (homeworkId: number) => {
    document.getElementById(`homework-${homeworkId}`)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Format date to a readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days left for submission
  const getDaysLeft = (submissionDate: string): number => {
    const today = new Date();
    const dueDate = new Date(submissionDate);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen overflow-auto">
      <div className="flex max-w-7xl mx-auto">
        {/* Main content area */}
        <div className="flex-1 px-4 relative">
          {/* Enhanced Loading state */}
          {loading && (
            <div className="flex flex-col justify-center items-center h-80">
              <div className="relative">
                <div className="w-12 h-12 border-2 border-gray-200 border-opacity-60 rounded-full"></div>
                <div className="absolute top-0 left-0 w-12 h-12 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-3 text-gray-600 text-sm font-normal">Loading content...</p>
            </div>
          )}
          
          {/* Enhanced Error state */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-lg mb-8 shadow-sm">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium">{error}</p>
              </div>
              <button 
                className="mt-3 text-sm text-red-600 hover:text-red-800 font-semibold flex items-center"
                onClick={() => window.location.reload()}
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          )}
          
          {!loading && !error && (
            <>
              {/* Announcements section - Enhanced styling */}
              <div className="mb-10">
                <div className="sticky top-0 z-20 pt-6 pb-4 bg-gray-50 backdrop-blur-sm bg-opacity-80 shadow-sm transition-all duration-200">
                  <div className="pb-4">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-lg mr-4">
                        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                          Announcements
                        </h1>
                        <p className="text-gray-600">
                          Published updates for your classes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pb-8 max-w-3xl pt-6">
                  {announcements.map((announcement) => {
                    const cardProps = {
                      title: announcement.title,
                      content: announcement.content,
                      author: announcement.class_name || "All Classes",
                      timestamp: formatDate(announcement.date)
                    };
                    
                    if (announcement.file_link) {
                      (cardProps as any).documentUrl = announcement.file_link;
                    }
                    if (announcement.file_name) {
                      (cardProps as any).documentName = announcement.file_name;
                    }
                    
                    return <Announcement_Card key={announcement.id} {...cardProps} />;
                  })}

                  {announcements.length === 0 && (
                    <div className="py-12 px-6 text-center bg-white rounded-lg border border-gray-200 shadow-sm">
                      <svg className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-gray-600 text-lg font-medium">
                        No announcements available at the moment
                      </p>
                      <p className="text-gray-500 mt-2">
                        Create your first announcement using the form in the sidebar
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 mb-8"></div>

              {/* Homework section - Enhanced styling */}
              <div id="homework-assignments">
                <div className="sticky top-0 z-10 pt-6 pb-4 bg-gray-50 backdrop-blur-sm bg-opacity-80 shadow-sm transition-all duration-200">
                  <div className="pb-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                          Homework Assignments
                        </h1>
                        <p className="text-gray-600">
                          Monitor student submissions and manage assignments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 max-w-3xl pt-6 pb-16">
                  {homeworks.map((homework) => {
                    const daysLeft = getDaysLeft(homework.submissionDate);
                    
                    return (
                      <div 
                        key={homework.id}
                        id={`homework-${homework.id}`}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                      >
                        <div className="border-l-4 border-blue-500 px-5 py-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1">
                                {homework.className}
                              </span>
                              <h3 className="text-lg font-medium text-gray-900">
                                {homework.title}
                              </h3>
                            </div>
                            
                            <div className="text-xs text-right">
                              <div className="flex items-center justify-end text-gray-600 mb-1">
                                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Due: {formatDate(homework.submissionDate)}
                              </div>
                              
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                daysLeft < 0 ? 'bg-red-100 text-red-800' : 
                                daysLeft <= 3 ? 'bg-amber-100 text-amber-800' : 
                                'bg-green-100 text-green-800'
                              }`}>
                                {daysLeft < 0 ? 'Overdue' : 
                                 daysLeft === 0 ? 'Due today' : 
                                 `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-4">
                            {homework.content}
                          </p>
                          
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">
                              <strong>Max marks:</strong> {homework.totalMarks}
                            </span>
                            
                            {homework.fileLink && (
                              <a
                                href={homework.fileLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                {homework.fileName || "View attachment"}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {homeworks.length === 0 && (
                    <div className="py-12 px-6 text-center bg-white rounded-lg border border-gray-200 shadow-sm">
                      <svg className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-600 text-lg font-medium">
                        No homework assignments at the moment
                      </p>
                      <p className="text-gray-500 mt-2">
                        Create assignments for your students using the sidebar controls
                      </p>
                      {/* <button
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                        onClick={() => window.location.href = "/professor/assignments/create"}
                      >
                        Create New Assignment
                      </button> */}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right sidebar - UNCHANGED as requested */}
        <div className="w-96 md:w-[400px] lg:w-[30%] pl-2 py-6 hidden md:block overflow-auto mr-4 mt-20">
          <div className="sticky top-6">
            {/* AnnouncementBox */}
            <AnnouncementBox
              classId="class-123"
              teacher={{
                name: "Professor Smith",
                avatar: "/images/avatar-placeholder.jpg"
              }}
              actionUrl="/api/announcements/create"
            />
            
            {/* Rest of sidebar content */}
            {/* <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-4 p-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Upcoming Events
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Parent-Teacher Meeting
                  </p>
                  <p className="text-xs text-gray-500">Tomorrow, 5:00 PM</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    End of Term Exams
                  </p>
                  <p className="text-xs text-gray-500">Starting in 2 weeks</p>
                </div>
              </div>
              <a
                href="/professor/calendar"
                className="block text-sm text-blue-600 hover:text-blue-800 mt-3"
              >
                View all events →
              </a>
            </div> */}

            {/* Professor homework summary widget */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-4 p-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Assignment Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Total Assignments</p>
                  <p className="text-sm font-medium">{homeworks.length}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Due This Week</p>
                  <p className="text-sm font-medium">2</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Needs Grading</p>
                  <p className="text-sm font-medium text-orange-600">8</p>
                </div>
              </div>
              {/* <button
                className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                onClick={() =>
                  (window.location.href = "/professor/assignments/create")
                }
              >
                Create New Assignment
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}