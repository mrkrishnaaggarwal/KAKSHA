import ProfessorAttendanceService from '../services/ProfessorAttendanceService.js';

class ProfessorAttendanceController {
    constructor() {
        this.professorAttendanceService = new ProfessorAttendanceService();
        console.log('[ProfessorAttendanceController] Initialized');
    }

    // Get subjects for a class for this professor
    async getSubjectsForClass(req, res) {
        console.log('\n[ProfessorAttendanceController] Get subjects for class:', {
            classId: req.params.classId,
            professorId: req.user.id,
            timestamp: new Date().toISOString()
        });

        try {
            const classId = req.params.classId;
            const professorId = req.user.id; 
            
            if (!classId) {
                return res.status(400).json({
                    success: false,
                    message: "Class ID parameter is required",
                    data: null
                });
            }
            
            const response = await this.professorAttendanceService.getSubjectsForClass(
                professorId, 
                classId
            );
            
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[ProfessorAttendanceController] Error:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                data: null
            });
        }
    }

    // Get attendance report for a class with subject
    async getClassAttendanceBySubject(req, res) {
        console.log('\n[ProfessorAttendanceController] Get class attendance by subject:', {
            classId: req.params.classId,
            subject: req.query.subject,
            timestamp: new Date().toISOString()
        });

        try {
            const { classId } = req.params;
            const { subject } = req.query;
            
            if (!classId) {
                return res.status(400).json({
                    success: false,
                    message: "Class ID parameter is required",
                    data: null
                });
            }
            
            if (!subject) {
                return res.status(400).json({
                    success: false,
                    message: "Subject parameter is required",
                    data: null
                });
            }
            
            const response = await this.professorAttendanceService.getClassAttendanceBySubject(
                classId, 
                subject
            );
            
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[ProfessorAttendanceController] Error:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                data: null
            });
        }
    }

    async getClassesOnDate(req, res) {
        console.log('\n[ProfessorAttendanceController] Get classes on date request:', {
            professorId: req.user.id,
            date: req.query.date,
            timestamp: new Date().toISOString()
        });

        try {
            const professorId = req.user.id;
            const date = req.query.date; // Expected format: YYYY-MM-DD
            
            if (!date) {
                return res.status(400).json({
                    success: false,
                    message: "Date parameter is required (format: YYYY-MM-DD)",
                    data: null
                });
            }
            
            const response = await this.professorAttendanceService.getClassesOnDate(professorId, date);
            
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[ProfessorAttendanceController] Error:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                data: null
            });
        }
    }

    async getStudentsInClass(req, res) {
        console.log('\n[ProfessorAttendanceController] Get students in class request:', {
            classId: req.params.classId,
            timestamp: new Date().toISOString()
        });

        try {
            const classId = req.params.classId;
            
            const response = await this.professorAttendanceService.getStudentsInClass(classId);
            
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[ProfessorAttendanceController] Error:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                data: null
            });
        }
    }

    async markAttendance(req, res) {
        console.log('\n[ProfessorAttendanceController] Mark attendance request:', {
            timeTableId: req.params.timeTableId,
            date: req.body.date,
            attendanceCount: req.body.attendance?.length || 0,
            timestamp: new Date().toISOString()
        });

        try {
            const timeTableId = req.params.timeTableId;
            const { date, attendance } = req.body;
            
            if (!date || !attendance || !Array.isArray(attendance)) {
                return res.status(400).json({
                    success: false,
                    message: "Date and attendance array are required",
                    data: null
                });
            }
            
            const response = await this.professorAttendanceService.markAttendance(
                timeTableId,
                date,
                attendance
            );
            
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[ProfessorAttendanceController] Error:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                data: null
            });
        }
    }
    async getTeachingClasses(req, res) {
        console.log('\n[ProfessorAttendanceController] Get teaching classes request:', {
            professorId: req.user.id,
            timestamp: new Date().toISOString()
        });
    
        try {
            const professorId = req.user.id;
            const response = await this.professorAttendanceService.getTeachingClasses(professorId);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[ProfessorAttendanceController] Error:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                data: null
            });
        }
    }
}

export default ProfessorAttendanceController;