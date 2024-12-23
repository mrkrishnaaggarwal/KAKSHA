"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Backend/src/routes/student.ts
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const student_1 = require("../controller/student");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
router.get('/profile', auth_1.authenticateToken, student_1.StudentController.getProfile);
router.put('/profile', auth_1.authenticateToken, student_1.StudentController.updateProfile);
router.put('/profile/photo', auth_1.authenticateToken, upload.single('photo'), student_1.StudentController.updateProfilePhoto);
exports.default = router;
