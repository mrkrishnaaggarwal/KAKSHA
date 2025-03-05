import pg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import apiResponse from '../utils/apiResponse.js';
import ResultModel from './resultModel.js';

const { Pool } = pg;

class ProfessorModel {
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        });
        this.resultModel = new ResultModel();
        console.log("Initialized PG client");
    }

    async login(email, password) {
        const startTime = Date.now();
        console.log('\n[ProfessorModel] Login attempt:', { email, timestamp: new Date().toISOString() });
        const client = await this.pool.connect();
        try {

            // Find professor
            console.log('[ProfessorModel] Searching for professor in database...');
            const Email = email.toLowerCase();
            const query = `SELECT * FROM "Professor" where email = $1`
            const result = await client.query(query,[Email]);
            if (!result.rows) {
                console.log('[ProfessorModel] Professor not found');
                return new apiResponse(401, null, "Invalid email or password");
            }

            // Verify password against stored hash
            console.log('[ProfessorModel] Verifying password...');
            const isValidPassword = await bcrypt.compare(password, result.rows[0].password);

            if (!isValidPassword) {
                console.log('[ProfessorModel] Invalid password');
                return new apiResponse(401, null, "Invalid email or password");
            }

            // Generate tokens
            console.log('[ProfessorModel] Password verified, generating tokens');
            const { password: _, ...professorData } = result.rows[0];
            
            const tokens = {
                accessToken: jwt.sign(
                    { id: result.rows[0].id },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                ),
                refreshToken: jwt.sign(
                    { id: result.rows[0].id },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '7d' }
                )
            };

            const duration = Date.now() - startTime;
            console.log(`[ProfessorModel] Login successful (${duration}ms)`);
            return new apiResponse(200, { professor: professorData, tokens }, "Login successful");

        } catch (error) {
            console.error('[ProfessorModel] Login error:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "An internal server error occurred");
        } finally {
            client.release();
        }
    }

    static async refresh(refreshToken) {
        console.log('\n[ProfessorModel] Token refresh attempt:', {
            tokenExists: !!refreshToken,
            timestamp: new Date().toISOString()
        });

        try {
            if (!refreshToken) {
                console.log('[ProfessorModel] No refresh token provided');
                return new apiResponse(403, null, "Refresh token not provided");
            }

            console.log('[ProfessorModel] Verifying refresh token...');
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            
            console.log('[ProfessorModel] Generating new access token...');
            const accessToken = jwt.sign(
                { id: decoded.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            console.log('[ProfessorModel] Access token generated successfully');
            return new apiResponse(200, { accessToken }, "Token refreshed successfully");
        } catch (error) {
            console.error('[ProfessorModel] Token refresh error:', {
                error: error.message,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(403, null, "Invalid refresh token");
        }
    }

    async getProfile(professorId) {
        console.log('\n[ProfessorModel] Fetching profile for professor ID:', professorId);
        
        const client = await this.pool.connect();
        
        try {
            const query = `
                SELECT 
                    id, 
                    roll_no, 
                    first_name, 
                    last_name, 
                    email, 
                    dept,
                    date_of_join,
                    dob, 
                    address,
                    CASE WHEN photo IS NULL THEN false ELSE true END AS has_photo
                FROM 
                    "Professor"
                WHERE 
                    id = $1`;
                
            const result = await client.query(query, [professorId]);
            
            if (result.rows.length === 0) {
                console.log('[ProfessorModel] Professor not found');
                return new apiResponse(404, null, "Professor not found");
            }
            
            console.log('[ProfessorModel] Profile fetched successfully');
            return new apiResponse(200, result.rows[0], "Profile fetched successfully");
        } catch (error) {
            console.error('[ProfessorModel] Error fetching profile:', error);
            return new apiResponse(500, null, "Database error occurred");
        } finally {
            client.release();
        }
    }
    
    async updateProfile(professorId, profileData) {
        console.log('\n[ProfessorModel] Updating profile for professor ID:', professorId);
        
        const client = await this.pool.connect();
        
        try {
            await client.query('BEGIN');
            
            const updateFields = [];
            const values = [];
            let paramIndex = 1;
            
            if (profileData.firstName !== undefined) {
                updateFields.push(`first_name = $${paramIndex++}`);
                values.push(profileData.firstName);
            }
            
            if (profileData.lastName !== undefined) {
                updateFields.push(`last_name = $${paramIndex++}`);
                values.push(profileData.lastName);
            }
            
            if (profileData.address !== undefined) {
                updateFields.push(`address = $${paramIndex++}`);
                values.push(profileData.address);
            }
            
            values.push(professorId);
            
            if (updateFields.length === 0) {
                await client.query('ROLLBACK');
                return new apiResponse(400, null, "No fields to update");
            }
            
            const query = `
                UPDATE "Professor"
                SET ${updateFields.join(', ')}
                WHERE id = $${paramIndex}
                RETURNING id, roll_no, first_name, last_name, email, dept, date_of_join, dob, address`;
                
            const result = await client.query(query, values);
            
            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return new apiResponse(404, null, "Professor not found");
            }
            
            await client.query('COMMIT');
            
            console.log('[ProfessorModel] Profile updated successfully');
            return new apiResponse(200, result.rows[0], "Profile updated successfully");
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('[ProfessorModel] Error updating profile:', error);
            return new apiResponse(500, null, "Database error occurred");
        } finally {
            client.release();
        }
    }
    
}

export default ProfessorModel;