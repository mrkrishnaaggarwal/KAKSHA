// Backend/src/routes/student.ts
import express from 'express';
import multer from 'multer';
import { StudentController } from '../controller/student';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.get('/profile', authenticateToken, StudentController.getProfile);
router.put('/profile', authenticateToken, StudentController.updateProfile);
router.put(
  '/profile/photo',
  authenticateToken,
  upload.single('photo'),
  StudentController.updateProfilePhoto
);

export default router;