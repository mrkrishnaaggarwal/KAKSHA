import ProfessorAnnouncementService from '../services/professorAnnouncementService.js';

class ProfessorAnnouncementController {
    constructor() {
        this.professorAnnouncementService = new ProfessorAnnouncementService();
        console.log('[ProfessorAnnouncementController] Initialized');
    }

    async createAnnouncement(req, res) {
        console.log('\n[ProfessorAnnouncementController] Create announcement request:', {
            body: req.body,
            professorId: req.user.id,
            timestamp: new Date().toISOString()
        });

        try {
            const professorId = req.user.id;
            const announcementData = req.body;

            console.log('[ProfessorAnnouncementController] Calling service to create announcement');
            const response = await this.professorAnnouncementService.createAnnouncement(
                professorId,
                announcementData
            );

            console.log('[ProfessorAnnouncementController] Service response:', {
                statusCode: response.statusCode,
                success: response.success,
                timestamp: new Date().toISOString()
            });

            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[ProfessorAnnouncementController] Error:', {
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

    async getProfessorAnnouncements(req, res) {
        console.log('\n[ProfessorAnnouncementController] Get professor announcements request:', {
            professorId: req.user.id,
            timestamp: new Date().toISOString()
        });

        try {
            const professorId = req.user.id;

            console.log('[ProfessorAnnouncementController] Calling service to get professor announcements');
            const response = await this.professorAnnouncementService.getProfessorAnnouncements(professorId);

            console.log('[ProfessorAnnouncementController] Service response:', {
                statusCode: response.statusCode,
                success: response.success,
                count: response.data?.length || 0,
                timestamp: new Date().toISOString()
            });

            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[ProfessorAnnouncementController] Error:', {
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

export default ProfessorAnnouncementController;