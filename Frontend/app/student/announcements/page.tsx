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
          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
              <p>{error}</p>
              <button 
                className="mt-2 text-sm underline"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          )}
          
          {!loading && !error && (
            <>
              {/* Announcements section */}
              <div className="mb-16">
                <div className="sticky top-0 z-20 pt-6 pb-4 bg-gray-50">
                  <div className="border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-medium text-gray-900 mb-1">
                      Announcements
                    </h1>
                    <p className="text-gray-600">
                      Stay updated with the latest news and opportunities
                    </p>
                  </div>
                </div>

                <div className="space-y-6 pb-8 max-w-3xl pt-4">
                  {announcements.map((announcement) => {
                    // Fix: Move key out of props object
                    const cardProps = {
                      title: announcement.title,
                      content: announcement.content,
                      author: `${announcement.first_name} ${announcement.last_name}`,
                      timestamp: new Date(announcement.date).toLocaleDateString()
                    };
                    
                    // Conditionally add document props only if they exist
                    if (announcement.file_link) {
                      (cardProps as any).documentUrl = announcement.file_link;
                    }
                    if (announcement.file_name) {
                      (cardProps as any).documentName = announcement.file_name;
                    }
                    
                    // Key is directly on component, not in props
                    return <Announcement_Card key={announcement.id} {...cardProps} />;
                  })}

                  {announcements.length === 0 && (
                    <div className="py-8 text-center bg-white rounded-lg border border-gray-200">
                      <p className="text-gray-600">
                        No announcements available at the moment
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 mb-8"></div>

              {/* Homework section */}
              <div>
                <div className="sticky top-0 z-10 pt-6 pb-4 bg-gray-50">
                  <div className="border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-medium text-gray-900 mb-1">
                      Homework Assignments
                    </h1>
                    <p className="text-gray-600">
                      Your current assignments and upcoming deadlines
                    </p>
                  </div>
                </div>

                <div className="space-y-6 max-w-3xl pt-4 pb-16">
                  {homeworks.map((homework) => {
                    // Include due date in the content
                    const dueDate = new Date(homework.submissionDate).toLocaleDateString();
                    const enhancedContent = `${homework.content}\n\nDue: ${dueDate}`;
                    
                    // Fix: Move key out of props object
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
                    
                    // Key is directly on component, not in props
                    return <Homework_Card key={homework.id} {...cardProps} />;
                  })}

                  {homeworks.length === 0 && (
                    <div className="py-8 text-center bg-white rounded-lg border border-gray-200">
                      <p className="text-gray-600">
                        No homework assignments at the moment
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-64 pl-4 py-6 hidden md:block">
          <div className="sticky top-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-4 p-4">
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
                href="/student/calendar"
                className="block text-sm text-blue-600 hover:text-blue-800 mt-3"
              >
                View all events →
              </a>
            </div>

            {/* Homework widget - Fix TypeError */}
            {!loading && !error && homeworks.length > 0 && (
              <div className="mt-4">
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