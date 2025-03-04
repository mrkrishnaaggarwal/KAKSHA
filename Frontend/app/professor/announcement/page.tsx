"use client";

import { useEffect, useRef, useState } from "react";
import Announcement_Card from "@/app/components/Anouncement_Card";
import Prof_Homework_Card from "@/app/components/Prof_Homework_Card";
import Homework_Home from "@/app/components/Homework_Home";
import {
  AiFillHome,
  AiFillBell,
  AiFillCalendar,
  AiFillBook,
  AiFillTrophy,
  AiFillClockCircle,
} from "react-icons/ai";
import Home from "@/app/page";

const sampleAnnouncements = [
  {
    id: 1,
    title: "Upcoming Career Fair",
    content:
      "Join us for the annual career fair happening next month. Over 50 top companies will be recruiting for various roles including internships and full-time positions. Prepare your resumes and don't miss this opportunity to network with industry professionals. The event will take place in the main campus auditorium from 10:00 AM to 4:00 PM.",
    author: "career_center",
    timestamp: "2 days ago",
    mediaUrl:
      "https://images.unsplash.com/photo-1560523159-6b681a1e1852?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    documentUrl: "https://example.com/files/career_fair_participants.pdf",
    documentName: "Career Fair - Participating Companies.pdf",
    documentType: "pdf",
  },
  {
    id: 2,
    title: "New Scholarship Opportunity",
    content:
      "Applications are now open for the Excellence in Technology scholarship. This scholarship covers full tuition for the upcoming academic year and is available to all CS and IT students with a GPA of 3.5 or higher. Submit your application by the end of this month. Include your transcript, a letter of recommendation, and a personal statement explaining your career goals.",
    author: "scholarship_office",
    timestamp: "1 week ago",
    documentUrl: "https://example.com/files/scholarship_application.docx",
    documentName: "Scholarship Application Form.docx",
    documentType: "docx",
  },
  {
    id: 3,
    title: "Workshop: Building Your Portfolio",
    content:
      "Learn how to create an impressive portfolio that will help you stand out to employers. This hands-on workshop will cover portfolio essentials, project showcasing techniques, and how to effectively present your skills. Bring your laptop and be ready to work on your personal portfolio during the session.",
    author: "design_dept",
    timestamp: "3 days ago",
    mediaUrl:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Registration for Next Semester",
    content:
      "Registration for the next semester begins on Monday. Please review your degree audit and consult with your academic advisor before selecting your courses. Priority registration will be based on credit hours completed. Remember to clear any holds on your account before your registration window opens.",
    author: "registrar_office",
    timestamp: "4 days ago",
    documentUrl: "https://example.com/files/course_catalog.xlsx",
    documentName: "Course Catalog Fall 2023.xlsx",
    documentType: "xlsx",
  },
  {
    id: 5,
    title: "Hackathon: Innovate for Good",
    content:
      "Calling all developers and designers! Join our 48-hour hackathon focused on creating solutions for social good. Teams of up to 4 members can participate. Prizes include internship opportunities, tech gadgets, and mentorship sessions with industry leaders. Food and refreshments will be provided throughout the event.",
    author: "tech_club",
    timestamp: "5 days ago",
    mediaUrl:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    documentUrl: "https://example.com/files/hackathon_guide.pptx",
    documentName: "Hackathon Guidelines & Rules.pptx",
    documentType: "pptx",
  },
];

const sampleHomework = [
  {
    id: 101,
    title: "Physics Assignment: Newton's Laws of Motion",
    content:
      "Complete the following problems from Chapter 4: Problems 12-18, 22, and 25. Show all work and calculations. Submit your solutions as a single PDF document through the portal by Friday at 11:59 PM. Late submissions will be penalized 10% per day.",
    author: "Dr. Richard Feynman",
    timestamp: "Posted 5 days ago",
    documentUrl: "https://example.com/files/physics_assignment.pdf",
    documentName: "Physics Problems Set 3.pdf",
    documentType: "pdf",
    dueDate: "March 3, 2025",
    totalStudents: 35,
    submittedCount: 18,
  },
  {
    id: 102,
    title: "Literature Analysis: The Great Gatsby",
    content:
      "Write a 1000-word essay analyzing the symbolism of color in F. Scott Fitzgerald's 'The Great Gatsby'. Focus on at least three different colors that appear throughout the novel and explain their significance to the themes and character development. Use MLA format with proper citations.",
    author: "Ms. Harper Lee",
    timestamp: "Posted 3 days ago",
    documentUrl: "https://example.com/files/literature_rubric.docx",
    documentName: "Essay Writing Guidelines.docx",
    documentType: "docx",
    dueDate: "March 15, 2025",
    totalStudents: 28,
    submittedCount: 5,
  },
  {
    id: 103,
    title: "Mathematics: Calculus Integration Methods",
    content:
      "Complete the worksheet on various integration techniques. You need to solve all 15 problems using appropriate methods (substitution, integration by parts, partial fractions, etc.). This assignment will prepare you for the upcoming mid-term exam.",
    author: "Prof. Alan Turing",
    timestamp: "Posted yesterday",
    documentUrl: "https://example.com/files/calculus_problems.pdf",
    documentName: "Integration Practice Sheet.pdf",
    documentType: "pdf",
    dueDate: "March 7, 2025",
    totalStudents: 42,
    submittedCount: 30,
  },
];

export default function AnnouncementsPage() {
  const [announcements] = useState(sampleAnnouncements);
  const [homeworks] = useState(sampleHomework);

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
    // Scroll to specific homework
    document.getElementById(`homework-${homeworkId}`)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen overflow-auto">
      <div className="flex max-w-7xl mx-auto">
        {/* Main content area */}
        <div className="flex-1 px-4 py-6 relative">
          {/* Announcements section with its own sticky header */}
          <div className="mb-16">
            {/* Announcements sticky header */}
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

            {/* Announcements content */}
            <div className="space-y-6 pb-8 max-w-3xl pt-4">
              {announcements.map((announcement) => (
                <Announcement_Card
                  key={announcement.id}
                  title={announcement.title}
                  content={announcement.content}
                  author={announcement.author}
                  timestamp={announcement.timestamp}
                  mediaUrl={announcement.mediaUrl}
                  documentUrl={announcement.documentUrl}
                  documentName={announcement.documentName}
                  documentType={announcement.documentType}
                />
              ))}

              {announcements.length === 0 && (
                <div className="py-8 text-center bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600">
                    No announcements available at the moment
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Visual separator between sections */}
          <div className="border-t border-gray-200 mb-8"></div>

          {/* Homework section with its own sticky header */}
          <div>
            {/* Homework sticky header */}
            <div className="sticky top-0 z-10 pt-6 pb-4 bg-gray-50">
              <div className="border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-medium text-gray-900 mb-1">
                  Homework Assignments
                </h1>
                <p className="text-gray-600">
                  Monitor student submissions and manage assignments
                </p>
              </div>
            </div>

            {/* Homework content */}
            <div className="space-y-6 max-w-3xl pt-4 pb-16">
              {homeworks.map((homework) => (
                <Prof_Homework_Card
                  key={homework.id}
                  title={homework.title}
                  content={homework.content}
                  author={homework.author}
                  timestamp={homework.timestamp}
                  documentUrl={homework.documentUrl}
                  documentName={homework.documentName}
                  documentType={homework.documentType}
                  dueDate={homework.dueDate}
                  totalStudents={homework.totalStudents}
                  submittedCount={homework.submittedCount}
                />
              ))}

              {homeworks.length === 0 && (
                <div className="py-8 text-center bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600">
                    No homework assignments at the moment
                  </p>
                </div>
              )}
            </div>
          </div>
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
                href="/professor/calendar"
                className="block text-sm text-blue-600 hover:text-blue-800 mt-3"
              >
                View all events →
              </a>
            </div>

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
              <button
                className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                onClick={() =>
                  (window.location.href = "/professor/assignments/create")
                }
              >
                Create New Assignment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
