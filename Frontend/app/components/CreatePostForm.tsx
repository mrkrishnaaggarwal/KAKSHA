import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';

interface Class {
  id: number;
  name: string;
}

interface CreatePostFormProps {
  classes: Class[];
  onSubmit: (postData: { title: string; content: string; classId: number }) => void;
  onCancel: () => void;
  defaultClassId?: number | null;
}

export default function CreatePostForm({ classes, onSubmit, onCancel, defaultClassId }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [classId, setClassId] = useState(defaultClassId || (classes[0]?.id || 0));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!classId) {
      setError('Please select a class');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        classId
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setClassId(defaultClassId || (classes[0]?.id || 0));
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Create New Post</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <HiX className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Class Selection */}
        <div className="mb-4">
          <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
            Class
          </label>
          <select
            id="class"
            value={classId}
            onChange={(e) => setClassId(parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Select a class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your post about?"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            maxLength={255}
            required
          />
          <div className="mt-1 text-right text-xs text-gray-500">
            {title.length}/255
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, ask questions, or start a discussion..."
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
            maxLength={5000}
          />
          <div className="mt-1 text-right text-xs text-gray-500">
            {content.length}/5000
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !classId}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}