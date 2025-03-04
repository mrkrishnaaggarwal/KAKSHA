import Joi from 'joi';
import apiResponse from '../utils/apiResponse.js';
import AnnouncementModel from '../models/AnnouncementModel.js';

class ProfessorAnnouncementService {
    constructor() {
        this.announcementModel = new AnnouncementModel();
        console.log('[ProfessorAnnouncementService] Initialized');
    }

    validateAnnouncementData(data) {
        console.log('\n[ProfessorAnnouncementService] Validating announcement data');

        const schema = Joi.object({
            classId: Joi.number().integer().required().messages({
                'number.base': 'Class ID must be a number',
                'any.required': 'Class ID is required'
            }),
            title: Joi.string().min(3).max(200).required().messages({
                'string.min': 'Title must be at least 3 characters long',
                'string.max': 'Title cannot exceed 200 characters',
                'any.required': 'Title is required'
            }),
            content: Joi.string().min(10).required().messages({
                'string.min': 'Content must be at least 10 characters long',
                'any.required': 'Content is required'
            }),
            visibility: Joi.number().integer().min(1).max(3).default(1).messages({
                'number.base': 'Visibility must be a number',
                'number.min': 'Visibility must be at least 1',
                'number.max': 'Visibility cannot exceed 3'
            }),
            fileName: Joi.string().allow(null, ''),
            fileLink: Joi.string().allow(null, '')
        });

        const { error } = schema.validate(data, { abortEarly: false });
        
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            console.log('[ProfessorAnnouncementService] Validation failed:', {
                errors: errorMessage,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(400, null, errorMessage);
        }

        console.log('[ProfessorAnnouncementService] Validation successful');
        return null;
    }

    async createAnnouncement(professorId, announcementData) {
        console.log('\n[ProfessorAnnouncementService] Creating announcement:', {
            professorId,
            title: announcementData.title,
            timestamp: new Date().toISOString()
        });

        try {
            // Validate the announcement data
            const validationError = this.validateAnnouncementData(announcementData);
            if (validationError) {
                return validationError;
            }

            // Prepare data for model
            const announcementToCreate = {
                ...announcementData,
                professorId,
                date: new Date()
            };

            // Call model to create announcement
            console.log('[ProfessorAnnouncementService] Calling model to create announcement');
            const response = await this.announcementModel.createAnnouncement(announcementToCreate);

            console.log('[ProfessorAnnouncementService] Model response received:', {
                success: response.success,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString()
            });

            return response;
        } catch (error) {
            console.error('[ProfessorAnnouncementService] Create announcement error:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "An internal server error occurred");
        }
    }

    async getProfessorAnnouncements(professorId) {
        console.log('\n[ProfessorAnnouncementService] Fetching professor announcements:', {
            professorId,
            timestamp: new Date().toISOString()
        });

        try {
            console.log('[ProfessorAnnouncementService] Calling model to get professor announcements');
            const response = await this.announcementModel.getProfessorAnnouncements(professorId);

            console.log('[ProfessorAnnouncementService] Model response received:', {
                success: response.success,
                statusCode: response.statusCode,
                count: response.data?.length || 0,
                timestamp: new Date().toISOString()
            });

            return response;
        } catch (error) {
            console.error('[ProfessorAnnouncementService] Get professor announcements error:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "An internal server error occurred");
        }
    }
}

export default ProfessorAnnouncementService;