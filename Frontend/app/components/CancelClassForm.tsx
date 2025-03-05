import React, { useState } from 'react';
import { CancelClassData, Class, Subject } from '../types';

interface CancelClassFormProps {
  classes: Class[];
  subjects: Subject[];
  loading: boolean;
  loadingSubjects: boolean;
  isSubmitting: boolean;
  onSubmit: (data: CancelClassData) => Promise<void>;
  onCancel: () => void;
  onClassChange: (classId: string) => void;
}

const CancelClassForm: React.FC<CancelClassFormProps> = ({
  classes,
  subjects,
  loading,
  loadingSubjects,
  isSubmitting,
  onSubmit,
  onCancel,
  onClassChange
}) => {
  const [formData, setFormData] = useState<CancelClassData>({
    classId: '',
    subject: '',
    date: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'classId' && value !== formData.classId) {
      onClassChange(value);
      setFormData(prev => ({ ...prev, subject: '', [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  // Helper function for getting minimum date (today) for date picker
  const getMinDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Cancel Class</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Class
        </label>
        <select
          name="classId"
          value={formData.classId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
          disabled={loading || isSubmitting}
        >
          <option value="">Select a class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Subject
        </label>
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={!formData.classId || loadingSubjects || isSubmitting}
          required
        >
          <option value="">Select a subject</option>
          {subjects.map((subject, index) => (
            <option key={index} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </select>
        {formData.classId && subjects.length === 0 && !loadingSubjects && (
          <p className="mt-1 text-sm text-amber-600">
            No subjects found for this class
          </p>
        )}
        {loadingSubjects && (
          <p className="mt-1 text-sm text-amber-600">
            Loading subjects...
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cancellation Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          min={getMinDate()}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : 'Cancel Class'}
        </button>
      </div>
    </form>
  );
};

export default CancelClassForm;