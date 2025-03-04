import ProfessorTimeTableService from '../services/professorTimeTableService.js';

class ProfessorTimeTableController {
    constructor() {
        this.professorTimeTableService = new ProfessorTimeTableService();
        console.log('[ProfessorTimeTableController] Initialized');
    }

    async getProfessorTimeTable(req, res) {
        console.log('\n[ProfessorTimeTableController] Get professor timetable request:', {
            professorId: req.user.id,
            timestamp: new Date().toISOString()
        });

        try {
            const professorId = req.user.id;
            
            console.log('[ProfessorTimeTableController] Calling service to get professor timetable');
            const response = await this.professorTimeTableService.getProfessorTimeTable(professorId);
            
            console.log('[ProfessorTimeTableController] Service response:', {
                statusCode: response.statusCode,
                success: response.success,
                timestamp: new Date().toISOString()
            });

            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[ProfessorTimeTableController] Error:', {
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

export default ProfessorTimeTableController;