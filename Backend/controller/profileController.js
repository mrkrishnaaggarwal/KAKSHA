import ProfileService from '../services/profileService.js';

class ProfileController {
    constructor() {
        this.profileService = new ProfileService();
        console.log('[ProfileController] Initialized');
    }

    async getProfile(req, res) {
        console.log('\n[ProfileController] Get profile request:', {
            userId: req.user.id,
            timestamp: new Date().toISOString()
        });

        try {
            const studentId = req.user.id;

            console.log('[ProfileController] Calling service to get profile');
            const response = await this.profileService.getProfile(studentId);

            console.log('[ProfileController] Service response:', {
                statusCode: response.statusCode,
                success: response.success,
                timestamp: new Date().toISOString()
            });

            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[ProfileController] Error:', {
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

    async updateProfile(req, res) {
        console.log('\n[ProfileController] Update profile request:', {
            userId: req.user.id,
            body: req.body,
            timestamp: new Date().toISOString()
        });

        try {
            const studentId = req.user.id;
            const profileData = req.body;

            console.log('[ProfileController] Calling service to update profile');
            const response = await this.profileService.updateProfile(studentId, profileData);

            console.log('[ProfileController] Service response:', {
                statusCode: response.statusCode,
                success: response.success,
                timestamp: new Date().toISOString()
            });

            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[ProfileController] Error:', {
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

export default ProfileController;