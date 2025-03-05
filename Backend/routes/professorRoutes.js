import { Router } from "express";
import upload from '../config/multerConfig.js';
import ProfessorController from "../controller/professorController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import ProfessorAnnouncementController from "../controller/professorAnnouncementController.js";
import ProfessorAttendanceController from '../controller/professorAttendanceController.js';
import ProfessorTimeTableController from '../controller/professorTimeTableController.js';
import ClassCancelledController from '../controller/classCancelledController.js';

const professorTimeTableController = new ProfessorTimeTableController();
const professorAttendanceController = new ProfessorAttendanceController();
const professorRouter = Router();
const professorController = new ProfessorController();
const professorAnnouncementController = new ProfessorAnnouncementController();
const classCancelledController = new ClassCancelledController();

console.log('[ProfessorRoutes] Initializing routes');

// Auth routes
professorRouter.post("/login", AuthMiddleware.ensureNotAuthenticated, (req, res) => {
    console.log('[ProfessorRoutes] Login route accessed');
    return professorController.login(req, res);
});

professorRouter.post("/refresh", AuthMiddleware.refreshTokenMiddleware, (req, res) => {
    console.log('[ProfessorRoutes] Refresh token route accessed');
    return professorController.refresh(req, res);
});

professorRouter.post("/logout", AuthMiddleware.authenticate, (req, res) => {
    console.log('[ProfessorRoutes] Logout route accessed');
    return professorController.logout(req, res);
});

// Protected routes
professorRouter.use(AuthMiddleware.authenticate);

// Results upload
professorRouter.post("/upload-results", upload.single('resultsFile'), (req, res) => {
    professorController.uploadResults(req, res);  
});

// Homework routes
professorRouter.get("/classes", (req, res) => {
    console.log('[ProfessorRoutes] Get classes route accessed');
    return professorController.getProfessorClasses(req, res);
});

// Changed from upload.single('homeworkFile') to regular JSON endpoint
professorRouter.post("/homework", (req, res) => {
    console.log('[ProfessorRoutes] Create homework route accessed');
    return professorController.createHomework(req, res);
});

professorRouter.get("/homework", (req, res) => {
    console.log('[ProfessorRoutes] Get homework route accessed');
    return professorController.getProfessorHomework(req, res);
});
// Announcement routes
professorRouter.post("/announcements", (req, res) => {
    console.log('[ProfessorRoutes] Create announcement route accessed');
    return professorAnnouncementController.createAnnouncement(req, res);
});

professorRouter.get("/announcements", (req, res) => {
    console.log('[ProfessorRoutes] Get professor announcements route accessed');
    return professorAnnouncementController.getProfessorAnnouncements(req, res);
});

//Attendance

professorRouter.get('/attendance/classes', (req, res) => {
    console.log('[ProfessorRoutes] Get classes for attendance route accessed');
    return professorAttendanceController.getClassesOnDate(req, res);
});

professorRouter.get('/attendance/class/:classId/students', (req, res) => {
    console.log('[ProfessorRoutes] Get students for attendance route accessed');
    return professorAttendanceController.getStudentsInClass(req, res);
});

professorRouter.post('/attendance/timetable/:timeTableId/mark', (req, res) => {
    console.log('[ProfessorRoutes] Mark attendance route accessed');
    return professorAttendanceController.markAttendance(req, res);
});

professorRouter.get("/teaching-classes",(req,res)=>{
    console.log('[ProfessorRoutes] Get teaching classes route accessed');
    return professorAttendanceController.getTeachingClasses(req,res);
});

professorRouter.get("/profile", (req, res) => professorController.getProfile(req, res));
professorRouter.put("/profile", (req, res) => professorController.updateProfile(req, res));

professorRouter.get("/timetable", (req, res) => {
    console.log('[ProfessorRoutes] Get professor timetable route accessed');
    return professorTimeTableController.getProfessorTimeTable(req, res);
});

// This route already exists, we just need to make sure it matches what we use in frontend
professorRouter.get('/attendance/class/:classId/subject-report', (req, res) => {
    console.log('[ProfessorRoutes] Get class attendance by subject report route accessed');
    return professorAttendanceController.getClassAttendanceBySubject(req, res);
});

// Also add the subjects route if not already there
professorRouter.get('/subjects/class/:classId', (req, res) => {
    console.log('[ProfessorRoutes] Get subjects for class route accessed');
    return professorAttendanceController.getSubjectsForClass(req, res);
});

professorRouter.post("/cancel-class", (req, res) => {
    console.log('[ProfessorRoutes] Cancel class route accessed');
    return classCancelledController.cancelClass(req, res);
});

console.log('[ProfessorRoutes] Routes initialized successfully');

export default professorRouter;