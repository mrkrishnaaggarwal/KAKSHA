import ClassCancelledService from '../services/classCancelledService.js';

class ClassCancelledController {
    constructor() {
        this.classCancelledService = new ClassCancelledService();
    }

    async getCancelledClasses(req, res) {
        try {
            const studentId = req.user.id; // From auth middleware
            const response = await this.classCancelledService.getCancelledClasses(studentId);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[ClassCancelledController] Error:', error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                data: null
            });
        }
    }
    
    async cancelClass(req, res) {
        console.log('\n[ClassCancelledController] Cancel class request:', {
            body: req.body,
            professorId: req.user.id,
            timestamp: new Date().toISOString()
        });
        
        try {
            const { classId, subject, date } = req.body;
            
            if (!classId || !subject || !date) {
                return res.status(400).json({
                    success: false,
                    message: "classId, subject, and date are required",
                    data: null
                });
            }
            
            const response = await this.classCancelledService.cancelClass(classId, subject, date);
            
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[ClassCancelledController] Error:', {
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

export default ClassCancelledController;