"use client";

import { useState } from "react";
import { FaRegCommentAlt } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { HiOutlineDotsVertical, HiDownload, HiOutlineClipboardCheck, HiOutlineUsers } from "react-icons/hi";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileAlt,
} from "react-icons/fa";

type PostProps = {
  title?: string;
  content?: string;
  author?: string;
  timestamp?: string;
  documentUrl?: string;
  documentName?: string;
  documentType?: string;
  dueDate?: string;
  totalStudents?: number;
  submittedCount?: number;
};

export default function Prof_Homework_Card({
  title = "Default Title",
  content = "This is default content...",
  author = "username",
  timestamp = "2 hours ago",
  documentUrl,
  documentName = "Document",
  documentType = "pdf",
  dueDate = "March 7, 2025",
  totalStudents = 30,
  submittedCount = 12,
}: PostProps) {
  const [commentsCount] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isViewingSubmissions, setIsViewingSubmissions] = useState(false);
  
  const handleShare = () => {
    console.log("Sharing post...");
  };

  // Function to handle document download
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDownloading(true);
    try {
      // Simulating download delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.open(documentUrl, '_blank');
    } catch (error) {
      console.error('Error downloading document:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Function to view student submissions
  const handleViewSubmissions = () => {
    setIsViewingSubmissions(true);
    console.log("Viewing student submissions");
    // In a real app, this would navigate to a submissions page or open a modal
  };

  // Function to get document icon based on document type
  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FaFilePdf size={20} className="text-red-500" />;
      case "docx":
      case "doc":
        return <FaFileWord size={20} className="text-blue-600" />;
      case "xlsx":
      case "xls":
        return <FaFileExcel size={20} className="text-green-600" />;
      case "pptx":
      case "ppt":
        return <FaFilePowerpoint size={20} className="text-orange-500" />;
      default:
        return <FaFileAlt size={20} className="text-gray-500" />;
    }
  };

  // Function to get a cleaner file name
  const getShortFileName = (name: string) => {
    if (name.length > 25) {
      return name.substring(0, 22) + "...";
    }
    return name;
  };

  // Calculate submission percentage
  const submissionPercentage = Math.round((submittedCount / totalStudents) * 100);
  
  // Check if due date has passed
  const isAssignmentClosed = () => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return today > due;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Card header with author info */}
      <div className="px-4 pt-4 pb-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
            {author.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{author}</div>
            <div className="text-xs text-gray-500">{timestamp}</div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <HiOutlineDotsVertical size={18} />
        </button>
      </div>

      {/* Card content */}
      <div className="px-4 pb-3">
        <h2 className="text-lg font-medium text-gray-900 mb-2">{title}</h2>
        <div className="text-gray-600">
          <p>
            {isExpanded
              ? content
              : content.length > 150
              ? `${content.slice(0, 150)}...`
              : content}
          </p>
          {content.length > 150 && (
            <button
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </div>

      {/* Document attachment (reference material) */}
      {documentUrl && (
        <div className="border-t border-gray-100 px-4 py-3">
          <div className="flex items-center py-2 px-3 rounded hover:bg-gray-50 transition-colors group max-w-sm mx-auto sm:mx-0">
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center flex-grow min-w-0"
            >
              <div className="h-9 w-9 rounded bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors flex-shrink-0">
                {getDocumentIcon(documentType)}
              </div>
              <div className="flex-grow min-w-0">
                <div className="font-medium text-gray-900 truncate group-hover:text-blue-600">
                  {getShortFileName(documentName)}
                </div>
                <div className="text-xs text-gray-500 uppercase">
                  {documentType}
                </div>
              </div>
            </a>
            <button
              onClick={handleDownload}
              className={`text-blue-600 ml-2 p-1.5 rounded-full hover:bg-blue-50 flex-shrink-0 ${
                isDownloading
                  ? "opacity-50"
                  : "opacity-0 group-hover:opacity-100"
              } transition-opacity`}
              disabled={isDownloading}
              aria-label="Download document"
              title="Download document"
            >
              <HiDownload size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Professor's section - Submission Statistics */}
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Submission Status</h3>
          <span className={`text-xs py-0.5 px-2 rounded-full ${isAssignmentClosed() ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
            {isAssignmentClosed() ? 'Closed' : `Due: ${dueDate}`}
          </span>
        </div>
      </div>
    </div>
  );
}