"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Announcement_Card from "@/app/components/Anouncement_Card";
import Homework_Card from "@/app/components/Homework_Card";
import Homework_Home from "@/app/components/Homework_Home";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  
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
        console.log("Fetching data... with token as:-", `Bearer ${token}`);
        
        // Fetch announcements
        const announcementsResponse = await axios.get(
          'http://localhost:8080/api/v1/student/announcement',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true // Add withCredentials
          }
        );
        console.log("Announcement response:-", announcementsResponse);
        // Fetch homeworks
        const homeworksResponse = await axios.get(
          'http://localhost:8080/api/v1/student/homework',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true // Add withCredentials
          }
        );
        console.log("Homework response:-", homeworksResponse);
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
      }
    };
    
    fetchData();
  }, [router]);
  
  const handleViewAllHomework = () => {
    // Scroll to homework section
    window.scrollTo({
      top:
        (
          document.querySelector(
            ".space-y-6.max-w-3xl.pt-4.pb-16"
          ) as HTMLElement
        )?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const handleSelectHomework = (homeworkId: number) => {
    document.getElementById(`homework-${homeworkId}`)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen overflow-auto">
      <div className="flex max-w-7xl mx-auto">
        {/* Main content area */}
        <div className="flex-1 px-4 py-6 relative">
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
                          Stay updated with the latest news and opportunities
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
                      author: `${announcement.first_name} ${announcement.last_name}`,
                      timestamp: new Date(announcement.date).toLocaleDateString()
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
                        Check back later for updates from your instructors
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 mb-8"></div>

              {/* Homework section - Enhanced styling */}
              <div>
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
                          Your current assignments and upcoming deadlines
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 max-w-3xl pt-6 pb-16">
                  {homeworks.map((homework) => {
                    // Include due date in the content
                    const dueDate = new Date(homework.submissionDate).toLocaleDateString();
                    const enhancedContent = `${homework.content}\n\nDue: ${dueDate}`;
                    
                    const cardProps = {
                      title: homework.title,
                      content: enhancedContent,
                      author: homework.professor,
                      timestamp: new Date(homework.publishDate).toLocaleDateString()
                    };
                    
                    if (homework.fileLink) {
                      (cardProps as any).documentUrl = homework.fileLink;
                    }
                    if (homework.fileName) {
                      (cardProps as any).documentName = homework.fileName;
                    }
                    
                    return <Homework_Card key={homework.id} {...cardProps} />;
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
                        Enjoy the break while it lasts!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right sidebar - Enhanced styling */}
        <div className="w-64 pl-4 py-6 hidden md:block mr-4">
          <div className="sticky top-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 mt-4 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="h-4 w-4 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upcoming Events
              </h3>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-400 pl-3 py-1">
                  <p className="text-sm font-medium text-gray-800">
                    Parent-Teacher Meeting
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <svg className="h-3 w-3 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Tomorrow, 5:00 PM
                  </p>
                </div>
                <div className="border-l-2 border-orange-400 pl-3 py-1">
                  <p className="text-sm font-medium text-gray-800">
                    End of Term Exams
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <svg className="h-3 w-3 mr-1 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Starting in 2 weeks
                  </p>
                </div>
              </div>
              <a
                href="/student/calendar"
                className="block text-sm text-blue-600 hover:text-blue-800 mt-4 flex items-center font-medium"
              >
                View all events
                <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Homework widget - Enhanced styling */}
            {!loading && !error && homeworks.length > 0 && (
              <div className="mt-5">
                <Homework_Home
                  homeworks={homeworks.map(hw => ({
                    id: hw.id,
                    title: hw.title,
                    dueDate: new Date(hw.submissionDate).toLocaleDateString('en-US', {
                      month: 'short', 
                      day: 'numeric'
                    }),
                    submitted: false,
                    author: hw.professor,
                    timestamp: new Date(hw.publishDate).toLocaleDateString()
                  }))}
                  onViewAll={handleViewAllHomework}
                  onSelectHomework={handleSelectHomework}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}