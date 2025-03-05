"use client";

import { useState, useRef } from "react";
import { FaRegCommentAlt } from "react-icons/fa";
import { RiShareForwardLine, RiCloseLine } from "react-icons/ri";
import { HiOutlineDotsVertical, HiDownload, HiUpload, HiPaperClip } from "react-icons/hi";
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
};

export default function Homework_Card({
  title = "Default Title",
  content = "This is default content...",
  author = "username",
  timestamp = "2 hours ago",
  documentUrl,
  documentName = "Document",
  documentType = "pdf",
}: PostProps) {
  const [commentsCount] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleShare = () => {
    console.log("Sharing post...");
  };

  // Function to handle document download
  const handleDownload = async (e: React.MouseEvent) => {
    // ...existing download code...
  };

  // Function to trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Function to remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Function to submit homework
  const submitHomework = async () => {
    if (!selectedFile) return;
    
    try {
      setIsSubmitting(true);
      
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('homeworkTitle', title);
      
      // In a real implementation, you would send this to your API
      // const response = await fetch('/api/submit-homework', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // For demo, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      console.log('Homework submitted:', selectedFile.name);
      
    } catch (error) {
      console.error('Error submitting homework:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to get the appropriate icon based on file type
  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'pdf':
        return <FaFilePdf size={20} className="text-red-500" />;
      case 'docx':
      case 'doc':
        return <FaFileWord size={20} className="text-blue-600" />;
      case 'xlsx':
      case 'xls':
        return <FaFileExcel size={20} className="text-green-600" />;
      case 'pptx':
      case 'ppt':
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

      {/* File upload section */}
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Your Submission</h3>
          {isSubmitted && (
            <span className="text-xs bg-green-100 text-green-800 py-0.5 px-2 rounded-full">
              Submitted
            </span>
          )}
        </div>
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isSubmitting || isSubmitted}
        />
        
        {/* Selected file preview */}
        {selectedFile && (
          <div className="border border-gray-200 rounded-lg mb-3 p-2">
            <div className="flex items-center px-2 py-2 rounded hover:bg-gray-50 transition-colors group max-w-sm mx-auto sm:mx-0">
              <div className="h-9 w-9 rounded bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                {getFileIcon(selectedFile)}
              </div>
              <div className="flex-grow min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {getShortFileName(selectedFile.name)}
                </div>
                <div className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
              
              {!isSubmitted && (
                <button
                  onClick={removeSelectedFile}
                  className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-100 flex-shrink-0"
                  disabled={isSubmitting}
                  title="Remove file"
                >
                  <RiCloseLine size={16} />
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Upload/Submit button */}
        {!isSubmitted ? (
          selectedFile ? (
            <button
              onClick={submitHomework}
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-md py-2 px-4 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Homework
                </>
              )}
            </button>
          ) : (
            <button
              onClick={triggerFileUpload}
              className="w-full flex items-center justify-center text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-md py-2 px-4"
            >
              <HiPaperClip className="mr-1.5" size={18} />
              Upload Your Work
            </button>
          )
        ) : (
          <div className="text-sm text-center text-gray-500 py-2">
            Your homework has been submitted successfully.
          </div>
        )}
      </div>

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