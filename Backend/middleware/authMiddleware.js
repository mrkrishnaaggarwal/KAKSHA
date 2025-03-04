import jwt from 'jsonwebtoken';
import apiResponse from '../utils/apiResponse.js';

class AuthMiddleware {
    static async authenticate(req, res, next) {
        try {
            console.log('[AuthMiddleware] Verifying token');
            
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            
            if (!token) {
                console.log('[AuthMiddleware] No token provided');
                return res.status(401).json(new apiResponse(401, null, 'Access token is required'));
            }

            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                req.user = { id: decoded.id };
                console.log('[AuthMiddleware] Token verified successfully');
                return next();
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    console.log('[AuthMiddleware] Token expired, attempting refresh');
                    return await AuthMiddleware.handleTokenRefresh(req, res, next);
                }
                console.log('[AuthMiddleware] Invalid token');
                return res.status(403).json(new apiResponse(403, null, 'Invalid token'));
            }
        } catch (error) {
            console.error('[AuthMiddleware] Error:', error);
            return res.status(500).json(new apiResponse(500, null, 'Internal server error'));
        }
    }

    static async handleTokenRefresh(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;
            
            if (!refreshToken) {
                console.log('[AuthMiddleware] No refresh token for automatic refresh');
                return res.status(401).json(new apiResponse(401, null, 'Authentication required'));
            }

            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            
            const newAccessToken = jwt.sign(
                { id: decoded.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '2m' }
            );

            res.set('Authorization', newAccessToken);
            req.user = { id: decoded.id };
            return next();
        } catch (error) {
            res.clearCookie('refreshToken');
            return res.status(401).json(new apiResponse(401, null, 'Authentication required'));
        }
    }

    static async refreshTokenMiddleware(req, res, next) {
        try {
            console.log('[AuthMiddleware] Verifying refresh token');
            
            const refreshToken = req.cookies.refreshToken;
            console.log(refreshToken);
            if (!refreshToken) {
                console.log('[AuthMiddleware] No refresh token in cookies');
                return res.status(401).json(new apiResponse(401, null, 'Refresh token required'));
            }

            try {
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                req.user = { id: decoded.id };
                console.log('[AuthMiddleware] Refresh token verified successfully');
                return next();
            } catch (error) {
                console.log('[AuthMiddleware] Invalid refresh token');
                res.clearCookie('refreshToken');
                return res.status(403).json(new apiResponse(403, null, 'Invalid refresh token'));
            }
        } catch (error) {
            console.error('[AuthMiddleware] Error:', error);
            return res.status(500).json(new apiResponse(500, null, 'Internal server error'));
        }
    }

    static async ensureNotAuthenticated(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];
        const refreshToken = req.cookies.refreshToken;
        console.log(refreshToken);
        if (token || refreshToken) {
            return res.status(400).json(new apiResponse(400, null, 'Already authenticated'));
        }
        next();
    }
}

export default AuthMiddleware;