"use client";

import { useState } from "react";
import { FaRegCommentAlt } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { HiOutlineDotsVertical, HiDownload } from "react-icons/hi";
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
  mediaUrl?: string;
  documentUrl?: string; // URL to the document (PDF, DOCX, etc.)
  documentName?: string; // Name of the document
  documentType?: string; // Type of document (pdf, docx, xlsx, etc.)
};

export default function Announcement_Card({
  title = "Default Title",
  content = "This is default content...",
  author = "username",
  timestamp = "2 hours ago",
  mediaUrl,
  documentUrl,
  documentName = "Document",
  documentType = "pdf",
}: PostProps) {
  const [commentsCount] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleShare = () => {
    console.log("Sharing post...");
  };

  // Function to get the appropriate icon based on document type
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

      {/* Media content if available */}
      {mediaUrl && (
        <div className="border-t border-gray-100">
          <img src={mediaUrl} alt="Post attachment" className="w-full h-auto" />
        </div>
      )}

      {/* Document attachment - SMALLER WIDTH VERSION */}
      {documentUrl && (
        <div className="border-t border-gray-100 px-4 py-3">
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center py-2 px-3 rounded hover:bg-gray-50 transition-colors group max-w-sm mx-auto sm:mx-0"
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
            <div className="text-blue-600 ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <HiDownload size={18} />
            </div>
          </a>
        </div>
      )}

      {/* Card footer with actions */}
      {/* <div className="px-4 py-3 border-t border-gray-100 flex gap-4">
        <button className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm">
          <FaRegCommentAlt size={15} />
          <span>{commentsCount} Comments</span>
        </button>
        <button
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm"
          onClick={handleShare}
        >
          <RiShareForwardLine size={16} />
          <span>Share</span>
        </button>
      </div> */}
    </div>
  );
}
