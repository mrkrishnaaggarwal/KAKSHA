'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ProfileEditPopupProps {
  isActive: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  userData: {
    firstName: string;
    lastName: string;
    rollNo: string;
    email: string;
    address?: string;
    gender?: string;
    age?: number;
    dob?: string;
    bloodGroup?: string;
    isProfessor?: boolean;
    className?: string;
    batch?: string;
    semester?: number;
    previousGrades?: string;
    bestSubject?: string;
    weakestSubject?: string;
    parentName?: string;
    parentContact?: string;
    parentOccupation?: string;
    department?: string;
    dateOfJoin?: string;
    yearsOfService?: number;
    qualification?: string;
    specialization?: string;
    researchInterests?: string;
    publications?: string;
    officeHours?: string;
    emergencyName?: string;
    emergencyContact?: string;
    emergencyAddress?: string;
  };
}

const ProfileEditPopup: React.FC<ProfileEditPopupProps> = ({ 
  isActive, 
  onClose, 
  onSubmit,
  userData 
}) => {
  const [formData, setFormData] = useState({ ...userData });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset form when userData changes
  useEffect(() => {
    if (isActive) {
      setFormData({ ...userData });
      setError(null);
      setSuccessMessage(null);
    }
  }, [userData, isActive]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Store date in ISO format
    setFormData(prev => ({
      ...prev,
      [name]: value ? new Date(value).toISOString().split('T')[0] : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Filter out unchanged fields to only send modified data
      const changedFields = Object.keys(formData).reduce((acc: any, key) => {
        if (formData[key as keyof typeof formData] !== userData[key as keyof typeof userData]) {
          acc[key] = formData[key as keyof typeof formData];
        }
        return acc;
      }, {});
      
      // Only proceed if there are changes
      if (Object.keys(changedFields).length === 0) {
        setSuccessMessage('No changes detected.');
        setLoading(false);
        return;
      }
      
      await onSubmit(changedFields);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Edit {userData.isProfessor ? 'Professor' : 'Student'} Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {successMessage}
            </div>
          )}

          {/* Basic Information Section */}
          <div className="border-b pb-4">
            <h3 className="text-md font-semibold text-gray-900 mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Roll Number (Read-only as it's typically not changed) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo || ''}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm text-gray-500"
                />
              </div>

              {/* Email (Read-only as it's typically not changed) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm text-gray-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender || "Not specified"}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Not specified">Not specified</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob ? formData.dob.substring(0, 10) : ''}
                  onChange={handleDateChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup || "Not specified"}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Not specified">Not specified</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* Address - Full width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Role-specific Information Section */}
          <div className="border-b pb-4">
            <h3 className="text-md font-semibold text-gray-900 mb-3">
              {userData.isProfessor ? 'Professional Information' : 'Academic Information'}
            </h3>
            
            {userData.isProfessor ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Professor-specific fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
                  <input
                    type="date"
                    name="dateOfJoin"
                    value={formData.dateOfJoin ? formData.dateOfJoin.substring(0, 10) : ''}
                    onChange={handleDateChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Research Interests</label>
                  <textarea
                    name="researchInterests"
                    value={formData.researchInterests || ''}
                    onChange={handleChange}
                    rows={2}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Publications</label>
                  <textarea
                    name="publications"
                    value={formData.publications || ''}
                    onChange={handleChange}
                    rows={2}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Office Hours</label>
                  <input
                    type="text"
                    name="officeHours"
                    value={formData.officeHours || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student-specific fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Class</label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Batch</label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Semester</label>
                  <input
                    type="number"
                    name="semester"
                    value={formData.semester || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Previous Grades</label>
                  <input
                    type="text"
                    name="previousGrades"
                    value={formData.previousGrades || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Best Performing Subject</label>
                  <input
                    type="text"
                    name="bestSubject"
                    value={formData.bestSubject || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject Needing Improvement</label>
                  <input
                    type="text"
                    name="weakestSubject"
                    value={formData.weakestSubject || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Student family information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent/Guardian Name</label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Contact</label>
                  <input
                    type="text"
                    name="parentContact"
                    value={formData.parentContact || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Parent Occupation</label>
                  <input
                    type="text"
                    name="parentOccupation"
                    value={formData.parentOccupation || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Emergency Contact Section */}
          <div className="pb-4">
            <h3 className="text-md font-semibold text-gray-900 mb-3">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                <input
                  type="text"
                  name="emergencyName"
                  value={formData.emergencyName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="emergencyAddress"
                  value={formData.emergencyAddress || ''}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPopup;