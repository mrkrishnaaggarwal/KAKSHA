import Joi from 'joi';
import apiResponse from '../utils/apiResponse.js';
import StudentModel from '../models/studentModel.js';
import ResultModel from '../models/resultModel.js';
import TimeTableModel from '../models/timeTableModel.js';
import AttendanceModel from '../models/attendanceModel.js';
import AnnouncementModel from '../models/AnnouncementModel.js';
import HomeWorkModel from '../models/HomeWorkModel.js';

class StudentService {
    constructor() {
        this.timeTableModel = new TimeTableModel();
        this.studentModel = new StudentModel();
        this.resultModel = new ResultModel();
        this.attendanceModel = new AttendanceModel();
        this.announcementModel = new AnnouncementModel();
        this.homeworkModel = new HomeWorkModel();
        console.log('[StudentService] Initialized with Student Model');
    }

    validateLoginData(data) {
        console.log('\n[StudentService] Starting login validation:', {
            email: data.email,
            timestamp: new Date().toISOString(),
        });

        const schema = Joi.object({
            email: Joi.string().email().trim().lowercase().required().messages({
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required',
            }),
            password: Joi.string().min(6).required().messages({
                'string.min': 'Password must be at least 6 characters long',
                'any.required': 'Password is required',
            }),
        });

        const { error } = schema.validate(data, { abortEarly: false });
        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(', ');
            console.log('[StudentService] Validation failed:', {
                errors: errorMessage,
                timestamp: new Date().toISOString(),
            });
            return new apiResponse(400, null, errorMessage);
        }

        console.log('[StudentService] Validation successful');
        return null;
    }

    async login(loginData) {
        console.log('\n[StudentService] Login attempt:', {
            email: loginData.email,
            timestamp: new Date().toISOString(),
        });

        try {
            console.log('[StudentService] Validating login data...');
            const validationError = this.validateLoginData(loginData);
            if (validationError) {
                console.log('[StudentService] Validation error detected');
                return validationError;
            }

            console.log('[StudentService] Calling model login method');
            const response = await this.studentModel.login(
                loginData.email,
                loginData.password
            );

            console.log('[StudentService] Model response received:', {
                success: response.success,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString(),
            });

            return response;
        } catch (error) {
            console.error('[StudentService] Login error:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
            return new apiResponse(500, null, 'An internal server error occurred');
        }
    }

    async refresh(token) {
        console.log('\n[StudentService] Token refresh attempt:', {
            tokenExists: !!token,
            timestamp: new Date().toISOString(),
        });

        try {
            if (!token) {
                console.log('[StudentService] No refresh token provided');
                return new apiResponse(403, null, 'No refresh token provided');
            }

            console.log('[StudentService] Calling model refresh method');
            const response = await this.studentModel.refresh(token);

            console.log('[StudentService] Refresh complete:', {
                success: response.success,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString(),
            });

            return response;
        } catch (error) {
            console.error('[StudentService] Refresh error:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
            return new apiResponse(500, null, 'An internal server error occurred');
        }
    }

    async getResults(user, query) {
        console.log('\n[StudentService] Fetching results for:', {
            query: query,
            timestamp: new Date().toISOString(),
        });
        try {
            const studentId = user.id;
            const filters = {
                semester: query.semester || '',
                exam: query.exam || '',
                subject: query.subject || '',
            };
            console.log('[StudentService] Calling model getResults method');
            const response = await this.resultModel.getStudentResults(
                studentId,
                filters
            );
            console.log('[StudentService] Model response received:', {
                success: response.success,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString(),
            });

            return response;
        } catch (error) {
            console.error('[StudentService] getResults Error:', error);
            return new apiResponse(500, null, 'Internal error');
        }
    }

    async getTimeTable(studentId) {
        console.log('\n[StudentService] Fetching timetable for student:', {
            studentId,
            timestamp: new Date().toISOString(),
        });

        try {
            console.log('[StudentService] Calling model getTimeTable method');
            const classId = await this.studentModel.getClassId(studentId);
            const response = await this.timeTableModel.getTimeTable(classId);
            console.log('[StudentService] Model response received:', {
                success: response.success,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString(),
            });

            return response;
        } catch (error) {
            console.error('[StudentService] getTimeTable Error:', error);
            return new apiResponse(500, null, 'Internal error');
        }
    }

    async getDayAttendance(user, query) {
        console.log('\n[StudentService] Fetching day attendance for student:', {
            user,
            timestamp: new Date().toISOString()
        });
        
        try {
            const studentId = user.id;
            const date = query.date || new Date().toISOString().split('T')[0];
            console.log('[StudentService] Calling model getDayAttendance method');
            const response = await this.attendanceModel.getDayAttendance(studentId, date);
            console.log('[StudentService] Model response received:', {
                success: response.success,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString()
            });
    
            return response;
        } catch (error) {
            console.error('[StudentService] getDayAttendance Error:', error);
            return new apiResponse(500, null, 'Internal error');
        }
    }

    async getAttendance(user) {
        console.log('\n[StudentService] Fetching attendance for student:', {
            user,
            timestamp: new Date().toISOString()
        });
        
        try {
            const studentId = user.id;
            console.log('[StudentService] Calling model getAttendance method');
            const response = await this.attendanceModel.getAttendance(studentId);
            console.log('[StudentService] Model response received:', {
                success: response.success,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString()
            });
    
            return response;
        } catch (error) {
            console.error('[StudentService] getAttendance Error:', error);
            return new apiResponse(500, null, 'Internal error');
        }
    }

    async getAnnouncements(studentId) {
        console.log('\n[StudentService] Fetching announcements for student:', {
            studentId,
            timestamp: new Date().toISOString(),
        });

        try {
            // Get the student's class ID first
            console.log('[StudentService] Getting student class ID');
            const classId = await this.studentModel.getClassId(studentId);

            if (classId instanceof apiResponse) {
                // If classId is an apiResponse, there was an error
                console.log('[StudentService] Error getting class ID');
                return classId;
            }

            console.log('[StudentService] Calling model getAnnouncementsByClassId method');
            const response = await this.announcementModel.getAnnouncementsByClassId(classId);

            console.log('[StudentService] Model response received:', {
                success: response.success,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString(),
            });

            return response;
        } catch (error) {
            console.error('[StudentService] getAnnouncements Error:', error);
            return new apiResponse(500, null, 'Internal error');
        }
    }

    async getHomework(studentId, filters = {}) {
        console.log('\n[StudentService] Fetching homework for student:', {
            studentId,
            filters,
            timestamp: new Date().toISOString(),
        });

        try {
            // Get the student's class ID first
            console.log('[StudentService] Getting student class ID');
            const classId = await this.studentModel.getClassId(studentId);

            if (classId instanceof apiResponse) {
                // If classId is an apiResponse, there was an error
                console.log('[StudentService] Error getting class ID');
                return classId;
            }

            // Add studentId to filters for submission lookup
            const homeworkFilters = {
                ...filters,
                studentId,
            };

            console.log('[StudentService] Calling model getHomeworkByClassId method');
            const response = await this.homeworkModel.getHomeworkByClassId(
                classId,
                homeworkFilters
            );

            console.log('[StudentService] Model response received:', {
                success: response.success,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString(),
            });

            return response;
        } catch (error) {
            console.error('[StudentService] getHomework Error:', error);
            return new apiResponse(500, null, 'Internal error');
        }
    }

    async getHomeworkDetails(studentId, homeworkId) {
        console.log('\n[StudentService] Fetching homework details:', {
            studentId,
            homeworkId,
            timestamp: new Date().toISOString(),
        });

        try {
            console.log('[StudentService] Calling model getHomeworkDetails method');
            const response = await this.homeworkModel.getHomeworkDetails(
                homeworkId,
                studentId
            );

            console.log('[StudentService] Model response received:', {
                success: response.success,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString(),
            });

            return response;
        } catch (error) {
            console.error('[StudentService] getHomeworkDetails Error:', error);
            return new apiResponse(500, null, 'Internal error');
        }
    }
}

export default StudentService;