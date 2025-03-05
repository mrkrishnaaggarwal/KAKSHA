import Joi from 'joi';
import apiResponse from '../utils/apiResponse.js';
import ProfessorAttendanceModel from '../models/ProfessorAttendanceModel.js';

class ProfessorAttendanceService {
    constructor() {
        this.professorAttendanceModel = new ProfessorAttendanceModel();
        console.log('[ProfessorAttendanceService] Initialized');
    }

    // Get the subjects taught by this professor for a class
    async getSubjectsForClass(professorId, classId) {
        console.log(`[ProfessorAttendanceService] Getting subjects for professor ${professorId} and class ${classId}`);
        
        try {
            if (!professorId) {
                return new apiResponse(400, null, "Professor ID is required");
            }
            
            if (!classId || isNaN(parseInt(classId))) {
                return new apiResponse(400, null, "Valid class ID is required");
            }
            
            const subjects = await this.professorAttendanceModel.getSubjectsByProfessorAndClass(
                professorId,
                parseInt(classId)
            );
            
            if (!subjects || subjects.length === 0) {
                return new apiResponse(404, null, "No subjects found for this professor and class");
            }
            
            return new apiResponse(200, { subjects }, "Subjects found successfully");
        } catch (error) {
            console.error('[ProfessorAttendanceService] Error:', error);
            return new apiResponse(500, null, "Service error occurred");
        }
    }

    // Get attendance data for a class by subject
    async getClassAttendanceBySubject(classId, subject) {
        console.log(`[ProfessorAttendanceService] Getting attendance for class ${classId} and subject ${subject}`);
        
        try {
            if (!classId || isNaN(parseInt(classId))) {
                return new apiResponse(400, null, "Valid class ID is required");
            }
            
            if (!subject) {
                return new apiResponse(400, null, "Subject is required");
            }
            
            const attendanceData = await this.professorAttendanceModel.getClassAttendanceBySubject(
                parseInt(classId),
                subject
            );
            
            return new apiResponse(200, attendanceData, "Attendance data fetched successfully");
        } catch (error) {
            console.error('[ProfessorAttendanceService] Error:', error);
            return new apiResponse(500, null, "Service error occurred");
        }
    }


    validateDateInput(dateStr) {
        const schema = Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({
            'string.pattern.base': 'Date must be in YYYY-MM-DD format',
            'any.required': 'Date is required'
        });

        const { error } = schema.validate(dateStr);
        if (error) {
            return error.details[0].message;
        }

        // Additional validation to check if date is valid
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }

        return null;
    }

    validateAttendanceData(data) {
        const schema = Joi.array().items(
            Joi.object({
                studentId: Joi.string().guid({ version: ['uuidv4'] }).required().messages({
                    'string.guid': 'Student ID must be a valid UUID',
                    'any.required': 'Student ID is required'
                }),
                status: Joi.string().valid('Present', 'Absent', 'Late').required().messages({
                    'any.only': 'Status must be one of: Present, Absent, Late',
                    'any.required': 'Status is required'
                })
            })
        ).min(1).required().messages({
            'array.min': 'At least one attendance record is required',
            'any.required': 'Attendance data is required'
        });
    
        const { error } = schema.validate(data, { abortEarly: false });
        
        if (error) {
            return error.details.map(detail => detail.message).join(', ');
        }
    
        return null;
    }

    async getClassesOnDate(professorId, dateStr) {
        console.log(`[ProfessorAttendanceService] Getting classes for professor ${professorId} on ${dateStr}`);
        
        try {
            // Validate date format
            const dateError = this.validateDateInput(dateStr);
            if (dateError) {
                return new apiResponse(400, null, dateError);
            }

            // Call model to get classes
            const response = await this.professorAttendanceModel.getClassesOnDate(professorId, dateStr);
            
            return response;
        } catch (error) {
            console.error('[ProfessorAttendanceService] Error:', error);
            return new apiResponse(500, null, "Service error occurred");
        }
    }

    async getStudentsInClass(classId) {
        console.log(`[ProfessorAttendanceService] Getting students for class ${classId}`);
        
        try {
            // Validate class ID
            if (!classId || isNaN(parseInt(classId))) {
                return new apiResponse(400, null, "Valid class ID is required");
            }

            // Call model to get students
            const response = await this.professorAttendanceModel.getStudentsInClass(parseInt(classId));
            
            return response;
        } catch (error) {
            console.error('[ProfessorAttendanceService] Error:', error);
            return new apiResponse(500, null, "Service error occurred");
        }
    }

    async markAttendance(timeTableId, dateStr, attendanceData) {
        console.log(`[ProfessorAttendanceService] Marking attendance for timetable ${timeTableId} on ${dateStr}`);
        
        try {
            // Validate timetable ID
            if (!timeTableId || isNaN(parseInt(timeTableId))) {
                return new apiResponse(400, null, "Valid timetable ID is required");
            }
            
            // Validate date format
            const dateError = this.validateDateInput(dateStr);
            if (dateError) {
                return new apiResponse(400, null, dateError);
            }
            
            // Validate attendance data
            const attendanceError = this.validateAttendanceData(attendanceData);
            if (attendanceError) {
                return new apiResponse(400, null, attendanceError);
            }

            // Call model to mark attendance
            const response = await this.professorAttendanceModel.markAttendance(
                parseInt(timeTableId),
                dateStr,
                attendanceData
            );
            
            return response;
        } catch (error) {
            console.error('[ProfessorAttendanceService] Error:', error);
            return new apiResponse(500, null, "Service error occurred");
        }
    }
    async getTeachingClasses(professorId) {
        console.log('\n[ProfessorAttendanceService] Getting teaching classes:', {
            professorId,
            timestamp: new Date().toISOString()
        });
    
        try {
            const response = await this.professorAttendanceModel.getTeachingClasses(professorId);
            
            console.log('[ProfessorAttendanceService] Retrieved teaching classes:', {
                success: response.success,
                count: response.data?.length || 0,
                timestamp: new Date().toISOString()
            });
    
            return response;
        } catch (error) {
            console.error('[ProfessorAttendanceService] Error getting teaching classes:', error);
            return new apiResponse(500, null, "Service error occurred");
        }
    }
}

export default ProfessorAttendanceService;