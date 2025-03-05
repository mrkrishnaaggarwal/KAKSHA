"use client";

import React, { useEffect, useState } from "react";
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
          element.scrollIntoView({ behavior: 'smooth' , block: 'start' });
        }, 100);
      }
    }
  };

  const scrollToSectionWithHash = (sectionId: string) => {
    // Update the URL hash without scrolling (using history API)
    const url = new URL(window.location.href);
    url.hash = sectionId;
    window.history.pushState({}, '', url);
    
    // Then scroll to the element
    scrollToSection();
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
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch data from APIs
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch announcements
        const announcementsResponse = await axios.get(
          "http://localhost:8080/api/v1/student/announcement",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        // Fetch homeworks
        const homeworksResponse = await axios.get(
          "http://localhost:8080/api/v1/student/homework",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
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
          localStorage.removeItem("token");
          router.push("/login");
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
    scrollToSectionWithHash("homework-assignments");
  };
  
  const handleSelectHomework = (homeworkId: number) => {
    // First update URL hash
    const url = new URL(window.location.href);
    url.hash = `homework-${homeworkId}`;
    window.history.pushState({}, '', url);
    
    // Then scroll to the element using our existing function
    scrollToSection();
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
    <div className="flex-1 bg-gradient-to-b from-purple-100 via-white to-white bg-gray-50 min-h-screen overflow-auto ">
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
              <p className="mt-3 text-gray-600 text-sm font-normal">
                Loading content...
              </p>
            </div>
          )}

          {/* Enhanced Error state */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-lg mb-8 shadow-sm">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-red-500 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="font-medium">{error}</p>
              </div>
              <button
                className="mt-3 text-sm text-red-600 hover:text-red-800 font-semibold flex items-center"
                onClick={() => window.location.reload()}
              >
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Announcements section - Styled like professor page */}
              <div id="announcements" className="mb-10 mt-6">
                <div className="sticky top-0 z-20 pt-6 pb-4 bg-gray-50 backdrop-blur-sm bg-opacity-80 shadow-sm transition-all duration-200">
                  <div className="pb-4">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-lg mr-4 ml-4">
                        <svg
                          className="h-6 w-6 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
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
                      timestamp: formatDate(announcement.date),
                    };

                    if (announcement.file_link) {
                      (cardProps as any).documentUrl = announcement.file_link;
                    }
                    if (announcement.file_name) {
                      (cardProps as any).documentName = announcement.file_name;
                    }

                    return (
                      <Announcement_Card key={announcement.id} {...cardProps} />
                    );
                  })}

                  {announcements.length === 0 && (
                    <div className="py-12 px-6 text-center bg-white rounded-lg border border-gray-200 shadow-sm">
                      <svg
                        className="h-16 w-16 mx-auto text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
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

              {/* Homework section - Styled like professor page with ID preserved */}
              <div id="homework-assignments">
                <div className="sticky top-0 z-10 pt-6 pb-4 bg-gray-50 backdrop-blur-sm bg-opacity-80 shadow-sm transition-all duration-200">
                  <div className="pb-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4 ml-4">
                        <svg
                          className="h-6 w-6 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
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
                              {/* <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1">
                                {homework.className || homework.class_name}
                              </span> */}
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
                      <svg
                        className="h-16 w-16 mx-auto text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
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

        {/* Right sidebar - kept as is with Quick Navigation */}
        <div className="w-72 pl-4 py-6 hidden md:block mr-4">
          <div className="sticky top-6">
            {/* Quick Navigation links card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="h-4 w-4 text-purple-600 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                Quick Navigation
              </h3>
              <div className="space-y-3">
                {/* Announcements */}
                <button
                  onClick={() => scrollToSectionWithHash("announcements")}
                  className="w-full flex items-center p-3 rounded-md hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors group text-left"
                >
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 text-purple-600 group-hover:bg-purple-200 transition-colors">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Announcements</p>
                    <p className="text-xs text-gray-500">
                      School notices and updates
                    </p>
                  </div>
                </button>

                {/* Homework */}
                <button
                  onClick={() => scrollToSectionWithHash("homework-assignments")}
                  className="w-full flex items-center p-3 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors group text-left"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600 group-hover:bg-blue-200 transition-colors">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Homework</p>
                    <p className="text-xs text-gray-500">
                      Assignments and deadlines
                    </p>
                  </div>
                </button>

                {/* Dashboard link */}
                <a
                  href="/student/dashboard"
                  className="flex items-center p-3 rounded-md hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors group"
                >
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600 group-hover:bg-green-200 transition-colors">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Dashboard</p>
                    <p className="text-xs text-gray-500">
                      Return to main dashboard
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Homework widget */}
            {!loading && !error && homeworks.length > 0 && (
              <div className="mt-5">
                <Homework_Home
                  homeworks={homeworks.map((hw) => ({
                    id: hw.id,
                    title: hw.title,
                    dueDate: new Date(hw.submissionDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    ),
                    submitted: false,
                    author: hw.professor,
                    timestamp: new Date(hw.publishDate).toLocaleDateString(),
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