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
}

export default ClassCancelledController;