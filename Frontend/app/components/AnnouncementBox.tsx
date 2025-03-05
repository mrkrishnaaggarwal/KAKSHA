"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnnouncementForm from './AnnouncementForm';
import HomeworkForm from './HomeworkForm';
import CancelClassForm from './CancelClassForm';
import NotificationDisplay from './NotificationDisplay';
import TypeSelector from './TypeSelector';
import { AnnouncementData, HomeworkData, CancelClassData, PostType, Class, Subject } from '../types';

interface PostProps {
  teacher: {
    name: string;
    avatar: string;
  };
}

const AnnouncementBox: React.FC<PostProps> = ({ teacher }) => {
  // Active post type state
  const [activePostType, setActivePostType] = useState<PostType | null>(null);

  // Classes state
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Subject state for cancelled class
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(false);

  // Success states
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch classes on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  // Reset states when changing post type
  useEffect(() => {
    setSuccessMessage(null);
    setError(null);
  }, [activePostType]);

  // Function to fetch classes taught by the professor
  const fetchClasses = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await axios.get('http://localhost:8080/api/v1/professor/classes', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials : true
      });
      if (response.data.success) {
        setClasses(response.data.data.map((cls: any) => ({
          id: cls.id,
          name: cls.name
        })));
      } else {
        setError("Failed to load classes");
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Error loading classes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch subjects for a class
  const fetchSubjectsForClass = async (classId: string) => {
    setLoadingSubjects(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await axios.get(`http://localhost:8080/api/v1/professor/subjects/class/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials : true
      });
      console.log(response);
      if (response.data.success) {
        // Format subjects based on your API response structure
        const formattedSubjects = response.data.data.subjects.map((subject: any) => ({
          id: subject.id || Math.random().toString(),
          name: subject
        }));
        console.log(formattedSubjects);
        setSubjects(formattedSubjects);
      } else {
        setSubjects([]);
      }
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  // Handle announcement submission
  const handleAnnouncementSubmit = async (data: AnnouncementData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/api/v1/professor/announcements',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials : true
        }
      );

      if (response.data.success || response.data.statusCode === 201) {
        setSuccessMessage("Announcement posted successfully!");
        setTimeout(() => {
          setActivePostType(null);
          setSuccessMessage(null);
        }, 2000);
      } else {
        setError(response.data.message || "Failed to post announcement");
      }
    } catch (err: any) {
      console.error("Error posting announcement:", err);
      setError(err.response?.data?.message || "Error posting announcement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle homework submission
  const handleHomeworkSubmit = async (data: HomeworkData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/api/v1/professor/homework',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials : true
        }
      );

      if (response.data.success || response.data.statusCode === 201) {
        setSuccessMessage("Homework assignment posted successfully!");
        setTimeout(() => {
          setActivePostType(null);
          setSuccessMessage(null);
        }, 2000);
      } else {
        setError(response.data.message || "Failed to post homework");
      }
    } catch (err: any) {
      console.error("Error posting homework:", err);
      setError(err.response?.data?.message || "Error posting homework. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancelled class submission
  const handleCancelClassSubmit = async (data: CancelClassData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/api/v1/professor/cancel-class',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials : true
        }
      );

      if (response.data.success || response.data.statusCode === 201) {
        setSuccessMessage("Class cancelled successfully!");
        setTimeout(() => {
          setActivePostType(null);
          setSuccessMessage(null);
        }, 2000);
      } else {
        setError(response.data.message || "Failed to cancel class");
      }
    } catch (err: any) {
      console.error("Error cancelling class:", err);
      setError(err.response?.data?.message || "Error cancelling class. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
            {teacher.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">{teacher.name}</p>
          <p className="text-sm text-gray-500">Professor</p>
        </div>
      </div>

      {/* Button Section - What do you want to share? */}
      {!activePostType && (
        <div className="border-t border-b border-gray-200 py-4">
          <button
            onClick={() => setActivePostType(null)}
            className="w-full text-left p-2 rounded-md hover:bg-gray-50"
          >
            <p className="text-gray-500 text-sm">Announce something to class...</p>
          </button>

          <div className="mt-4">
            <TypeSelector onSelectType={setActivePostType} />
          </div>
        </div>
      )}

      {/* Notification area - shared across all forms */}
      <NotificationDisplay type={successMessage ? 'success' : error ? 'error' : null} message={successMessage || error} />

      {/* Announcement Form */}
      {activePostType === 'announcement' && (
        <AnnouncementForm 
          classes={classes}
          loading={loading}
          isSubmitting={isSubmitting}
          onSubmit={handleAnnouncementSubmit}
          onCancel={() => setActivePostType(null)}
        />
      )}

      {/* Homework Form */}
      {activePostType === 'homework' && (
        <HomeworkForm 
          classes={classes}
          loading={loading}
          isSubmitting={isSubmitting}
          onSubmit={handleHomeworkSubmit}
          onCancel={() => setActivePostType(null)}
        />
      )}
      
      {/* Cancel Class Form */}
      {activePostType === 'cancelClass' && (
        <CancelClassForm 
          classes={classes}
          subjects={subjects}
          loading={loading}
          loadingSubjects={loadingSubjects}
          isSubmitting={isSubmitting}
          onSubmit={handleCancelClassSubmit}
          onCancel={() => setActivePostType(null)}
          onClassChange={fetchSubjectsForClass}
        />
      )}
    </div>
  );
};

export default AnnouncementBox;