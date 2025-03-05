import Joi from 'joi';
import apiResponse from '../utils/apiResponse.js';
import StudentModel from '../models/studentModel.js';

class ProfileService {
    constructor() {
        this.studentModel = new StudentModel();
        console.log('[ProfileService] Initialized');
    }

    validateUpdateProfileData(data) {
        console.log('\n[ProfileService] Validating profile update data');

        const schema = Joi.object({
            firstName: Joi.string().min(2).max(100).messages({
                'string.min': 'First name must be at least 2 characters long',
                'string.max': 'First name cannot exceed 100 characters',
            }),
            lastName: Joi.string().min(2).max(100).messages({
                'string.min': 'Last name must be at least 2 characters long',
                'string.max': 'Last name cannot exceed 100 characters',
            }),
            address: Joi.string().allow('', null),
        });

        const { error } = schema.validate(data, { abortEarly: false });
        
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            console.log('[ProfileService] Validation failed:', {
                errors: errorMessage,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(400, null, errorMessage);
        }

        console.log('[ProfileService] Validation successful');
        return null;
    }

    async getProfile(studentId) {
        console.log('\n[ProfileService] Getting student profile:', {
            studentId,
            timestamp: new Date().toISOString()
        });

        try {
            console.log('[ProfileService] Calling model to get student profile');
            const response = await this.studentModel.getStudentProfile(studentId);

            console.log('[ProfileService] Model response received:', {
                success: response.success,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString()
            });

            return response;
        } catch (error) {
            console.error('[ProfileService] Get profile error:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "An internal server error occurred");
        }
    }

    async updateProfile(studentId, profileData) {
        console.log('\n[ProfileService] Updating student profile:', {
            studentId,
            timestamp: new Date().toISOString()
        });

        try {
            // Validate the profile data
            const validationError = this.validateUpdateProfileData(profileData);
            if (validationError) {
                return validationError;
            }

            console.log('[ProfileService] Calling model to update student profile');
            const response = await this.studentModel.updateStudentProfile(studentId, profileData);

            console.log('[ProfileService] Model response received:', {
                success: response.success,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString()
            });

            return response;
        } catch (error) {
            console.error('[ProfileService] Update profile error:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "An internal server error occurred");
        }
    }
}

export default ProfileService;