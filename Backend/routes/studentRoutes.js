import { Router } from "express";
import StudentController from "../controller/studentController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import ClassCancelledController from '../controller/classCancelledController.js';
import ProfileController from '../controller/profileController.js';
import CommunityController from '../controller/CommunityController.js';

const profileController = new ProfileController();
const studentRouter = Router();
const studentController = new StudentController();
const classCancelledController = new ClassCancelledController();
const communityController = new CommunityController();

// ===================================
// Public Authentication Routes
// ===================================
studentRouter.post(
    "/login",
    AuthMiddleware.ensureNotAuthenticated,
    (req, res) => studentController.login(req, res)
);

studentRouter.post(
    "/refresh",
    AuthMiddleware.refreshTokenMiddleware,
    (req, res) => studentController.refresh(req, res)
);

studentRouter.post(
    "/logout",
    AuthMiddleware.authenticate, // Optional: keep this if you want to ensure the user is logged in
    (req, res) => {
        console.log('[StudentRoutes] Logout route accessed');
        return studentController.logout(req, res);
    }
);

// ===================================
// Protected Routes
// ===================================
studentRouter.use(AuthMiddleware.authenticate);

// Student Academic Resources
studentRouter.get(
    "/results",
    (req, res) => studentController.getResults(req, res)
);

studentRouter.get(
    "/timetable",
    (req, res) => studentController.getTimeTable(req, res)
);

studentRouter.get(
    "/day-attendance",
    (req, res) => studentController.getDayAttendance(req, res)
);

studentRouter.get(
    "/attendance",
    (req, res) => studentController.getAttendance(req, res)
);

studentRouter.get(
    "/announcement",
    (req, res) => studentController.getAnnouncement(req, res)
);

// Homework routes
studentRouter.get(
    "/homework",
    (req, res) => studentController.getHomework(req, res)
);

studentRouter.get(
    "/homework/:id",
    (req, res) => studentController.getHomeworkDetails(req, res)
);

// Test Protected Route
studentRouter.get(
    '/protected',
    (req, res) => res.json({ message: 'You have access to this protected route' })
);

studentRouter.get(
    "/cancelled-classes",
    (req, res) => classCancelledController.getCancelledClasses(req, res)
);
studentRouter.get("/profile", (req, res) => {
    console.log('[StudentRoutes] Get profile route accessed');
    return profileController.getProfile(req, res);
});

studentRouter.put("/profile", (req, res) => {
    console.log('[StudentRoutes] Update profile route accessed');
    return profileController.updateProfile(req, res);
});

// Community routes
studentRouter.get("/community/init", (req, res) => {
    console.log('[StudentRoutes] Initialize community tables route accessed');
    return communityController.initializeTables(req, res);
});

studentRouter.get("/community/posts", (req, res) => {
    console.log('[StudentRoutes] Get community posts route accessed');
    return communityController.getPosts(req, res);
});

studentRouter.post("/community/posts", (req, res) => {
    console.log('[StudentRoutes] Create community post route accessed');
    return communityController.createPost(req, res);
});

studentRouter.get("/community/posts/:postId", (req, res) => {
    console.log('[StudentRoutes] Get community post details route accessed');
    return communityController.getPost(req, res);
});

studentRouter.post("/community/posts/:postId/comments", (req, res) => {
    console.log('[StudentRoutes] Create community comment route accessed');
    return communityController.createComment(req, res);
});

studentRouter.post("/community/vote/:targetId", (req, res) => {
    console.log('[StudentRoutes] Community vote route accessed');
    return communityController.vote(req, res);
});

studentRouter.get("/community/votes", (req, res) => {
    console.log('[StudentRoutes] Get user votes route accessed');
    return communityController.getUserVotes(req, res);
});

export default studentRouter;