
export interface MainLayoutProps {
  phone: string;
  address: string;
}

export interface EditButtonProps {
  onClick: () => void;
}

export interface PopUpProps {
  isActive: boolean;
  onClose: () => void;
}

export interface ProfileCardProps {
  title: string;
  children: React.ReactNode;
}

export interface UserData {
  bloodGroup: string;
  contactNumber: string;
  address: string;
  parentsOccupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyAddress: string;
}

export interface Student {
  rollNo: string;
  firstName: string;
  lastName: string;
  dob: string;
  address?: string;
  class?: {
    name?: string;
    class_teacher?: string;
  };
  semester: number;
  batch: string;
  email: string;
}

export type PostType = 'announcement' | 'homework' | 'cancelClass';
export type NotificationType = 'success' | 'error' | null;

export interface Teacher {
  name: string;
  avatar: string;
}

export interface Class {
  id: number;
  name: string;
}

export interface Subject {
  id: number | string;
  name: string;
}

export interface AnnouncementData {
  classId: string;
  title: string;
  content: string;
  visibility: number;
}

export interface HomeworkData {
  classId: string;
  title: string;
  content: string;
  fileName: string;
  fileLink: string;
  submissionDate: string;
  totalMarks: number;
}

export interface CancelClassData {
  classId: string;
  subject: string;
  date: string;
}
