export interface StudentProfile {
  id: number;
  rollNo: string;
  firstName: string;
  lastName: string;
  email: string;
  classId?: number;
  semester: number;
  batch: string;
  dob: Date;
  address?: string;
  photo?: Buffer;
  class?: {
    name: string;
    class_teacher: string;
  };
}

export interface ProfileUpdateDto {
  firstName?: string;
  lastName?: string;
  address?: string;
  email?: string;
}