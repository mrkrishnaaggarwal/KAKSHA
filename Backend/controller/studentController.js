import StudentService from '../services/studentServices.js';

class StudentController {
    constructor() {
        this.studentService = new StudentService();
        console.log('[StudentController] Initialized with Student Service');
    }

    async login(req, res) {
        console.log('\n[StudentController] Login Request:', req.body);

        try {
            console.log('[StudentController] Calling service login method');
            const response = await this.studentService.login(req.body);
            console.log('[StudentController] Service response:', {
                statusCode: response.statusCode,
                success: response.success
            });

            if (response.success && response.data?.tokens) {
                console.log('[StudentController] Setting refresh token cookie');
                res.cookie('refreshToken', response.data.tokens.refreshToken, {
                    httpOnly: true,
                    // secure: process.env.NODE_ENV === 'production', //commented because making http req in dev mode
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
            }

            console.log('[StudentController] Sending response');
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[StudentController] Controller Error:', error);
            return res.status(500).json({
                success: false,
                message: "An internal server error occurred",
                data: null
            });
        }
    }
    
    async getResults(req, res) {
        console.log('[StudentController] Fetching results for:', req.query);
        try {
            const response = await this.studentService.getResults(req.user,req.query);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[StudentController] getResults Error:', error);
            return res.status(500).json({ success: false, message: "Internal error", data: null });
        }
    }
    
    async refresh(req, res) {
        console.log('\n[StudentController] Refresh Token Request');

        try {
            const refreshToken = req.cookies.refreshToken;
            console.log(refreshToken);
            
            console.log('[StudentController] Calling service refresh method');
            const response = await this.studentService.refresh(refreshToken);
            
            console.log('[StudentController] Service response:', {
                statusCode: response.statusCode,
                success: response.success
            });

            if (response.success && response.data?.accessToken) {
                return res.status(response.statusCode).json(response);
            }

            res.clearCookie('refreshToken');
            return res.status(response.statusCode).json(response);

        } catch (error) {
            console.error('[StudentController] Refresh error:', error);
            res.clearCookie('refreshToken');
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: "An internal server error occurred"
            });
        }
    }
    
    async getTimeTable(req, res) {
        console.log('\n[StudentController] TimeTable Request');
        try {
            const studentId = req.user.id; // From auth middleware
            console.log('[StudentController] Calling service getTimeTable method');
            const response = await this.studentService.getTimeTable(studentId);
            
            console.log('[StudentController] Service response:', {
                statusCode: response.statusCode,
                success: response.success
            });
    
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[StudentController] TimeTable Error:', error);
            return res.status(500).json({
                success: false,
                message: "An internal server error occurred",
                data: null
            });
        }
    }
    
    async getDayAttendance(req, res) {
        console.log('\n[StudentController] Day Attendance Request for:', req.query);
        try {
            console.log('[StudentController] Calling service getDayAttendance method');
            const response = await this.studentService.getDayAttendance(req.user,req.query);
            
            console.log('[StudentController] Service response:', {
                statusCode: response.statusCode,
                success: response.success
            });
    
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[StudentController] Day Attendance Error:', error);
            return res.status(500).json({
                success: false,
                message: "An internal server error occurred",
                data: null
            });
        }
    }
    
    async getAttendance(req, res) {
        console.log('\n[StudentController] Attendance Request');
        try {
            console.log('[StudentController] Calling service getAttendance method');
            const response = await this.studentService.getAttendance(req.user);
            
            console.log('[StudentController] Service response:', {
                statusCode: response.statusCode,
                success: response.success
            });
    
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[StudentController] Attendance Error:', error);
            return res.status(500).json({
                success: false,
                message: "An internal server error occurred",
                data: null
            });
        }
    }

    async getAnnouncement(req, res) {
        console.log('\n[StudentController] Announcement Request');
        try {
            const studentId = req.user.id; // From auth middleware
            console.log('[StudentController] Calling service getAnnouncements method');
            const response = await this.studentService.getAnnouncements(studentId);
            
            console.log('[StudentController] Service response:', {
                statusCode: response.statusCode,
                success: response.success
            });

            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[StudentController] Announcement Error:', error);
            return res.status(500).json({
                success: false,
                message: "An internal server error occurred",
                data: null
            });
        }
    }

    async getHomework(req, res) {
        console.log('\n[StudentController] Homework Request with filters:', req.query);
        try {
            const studentId = req.user.id; // From auth middleware
            const filters = {
                status: req.query.status,
                dateFrom: req.query.dateFrom,
                dateTo: req.query.dateTo
            };
            
            console.log('[StudentController] Calling service getHomework method');
            const response = await this.studentService.getHomework(studentId, filters);
            
            console.log('[StudentController] Service response:', {
                statusCode: response.statusCode,
                success: response.success
            });

            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[StudentController] Homework Error:', error);
            return res.status(500).json({
                success: false,
                message: "An internal server error occurred",
                data: null
            });
        }
    }

    async getHomeworkDetails(req, res) {
        console.log('\n[StudentController] Homework Details Request');
        try {
            const studentId = req.user.id;
            const homeworkId = req.params.id;
            
            console.log('[StudentController] Calling service getHomeworkDetails method');
            const response = await this.studentService.getHomeworkDetails(studentId, homeworkId);
            
            console.log('[StudentController] Service response:', {
                statusCode: response.statusCode,
                success: response.success
            });

            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[StudentController] Homework Details Error:', error);
            return res.status(500).json({
                success: false,
                message: "An internal server error occurred",
                data: null
            });
        }
    }

    async logout(req, res) {
        console.log('\n[StudentController] Logout Request');
        
        try {
            // Clear the HTTP-only refresh token cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                // secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            
            console.log('[StudentController] Successfully cleared refresh token cookie');
            
            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Logged out successfully",
                data: null
            });
        } catch (error) {
            console.error('[StudentController] Logout Error:', error);
            return res.status(500).json({
                success: false,
                message: "An internal server error occurred",
                data: null
            });
        }
    }
}

export default StudentController;