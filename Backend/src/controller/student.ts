import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProfileUpdateDto } from '../types/profile';

const prisma = new PrismaClient();

export class StudentController {
  // Get student profile
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id; // Assuming middleware sets user

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const student = await prisma.student.findUnique({
        where: {
          id: userId
        },
        include: {
          class: {
            select: {
              name: true,
              class_teacher: true
            }
          }
        }
      });

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const { password, ...studentData } = student;
      return res.json(studentData);
    } catch (error) {
      console.error('Profile fetch error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update student profile
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const updateData: ProfileUpdateDto = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const student = await prisma.student.update({
        where: {
          id: userId
        },
        data: updateData
      });

      const { password, ...updatedStudentData } = student;
      return res.json(updatedStudentData);
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update profile photo
  static async updateProfilePhoto(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const photoBuffer = req.file?.buffer;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!photoBuffer) {
        return res.status(400).json({ error: 'No photo provided' });
      }

      await prisma.student.update({
        where: {
          id: userId
        },
        data: {
          photo: photoBuffer
        }
      });

      return res.json({ message: 'Profile photo updated successfully' });
    } catch (error) {
      console.error('Photo upload error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}