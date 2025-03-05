import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { NotificationType } from '../types';

interface NotificationProps {
  type: NotificationType;
  message: string;
}

const NotificationAlert: React.FC<NotificationProps> = ({ type, message }) => {
  if (!type || !message) return null;
  
  return type === 'success' ? (
    <div className="mb-4 p-3 rounded-md bg-green-50 text-green-800 flex items-center">
      <CheckCircleIcon className="h-5 w-5 mr-2" />
      {message}
    </div>
  ) : (
    <div className="mb-4 p-3 rounded-md bg-red-50 text-red-800 flex items-center">
      <XCircleIcon className="h-5 w-5 mr-2" />
      {message}
    </div>
  );
};

export default NotificationAlert;