import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

type NotificationType = 'success' | 'error' | null;

interface NotificationDisplayProps {
  type: NotificationType;
  message: string | null;
}

const NotificationDisplay: React.FC<NotificationDisplayProps> = ({ type, message }) => {
  if (!type || !message) return null;
  
  return (
    <div className={`mb-4 p-3 rounded-md ${
      type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
    } flex items-center`}>
      {type === 'success' ? (
        <CheckCircleIcon className="h-5 w-5 mr-2" />
      ) : (
        <XCircleIcon className="h-5 w-5 mr-2" />
      )}
      {message}
    </div>
  );
};

export default NotificationDisplay;