import pg from 'pg';
import dotenv from 'dotenv';
import apiResponse from '../utils/apiResponse.js';

dotenv.config();
const { Pool } = pg;

class AnnouncementModel {
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        });
    }

    async getAnnouncementsByClassId(classId) {
        console.log('\n[AnnouncementModel] Fetching announcements for class:', {
            classId,
            timestamp: new Date().toISOString()
        });
        
        const client = await this.pool.connect();
        
        try {
            const query = `
                SELECT a.*, p.first_name, p.last_name 
                FROM "announcements" a
                JOIN "Professor" p ON a.professor_id = p.id
                WHERE a.class_id = $1 
                ORDER BY a.date DESC`;
                
            const result = await client.query(query, [classId]);
            
            console.log(`[AnnouncementModel] Found ${result.rows.length} announcements`);
            
            return new apiResponse(200, result.rows, "Announcements fetched successfully");
        } catch (error) {
            console.error('[AnnouncementModel] Error fetching announcements:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "An internal server error occurred");
        } finally {
            client.release();
        }
    }

    // New method to create announcement
    async createAnnouncement(announcementData) {
        console.log('\n[AnnouncementModel] Creating new announcement:', {
            title: announcementData.title,
            classId: announcementData.classId,
            professorId: announcementData.professorId,
            timestamp: new Date().toISOString()
        });
        
        const client = await this.pool.connect();
        
        try {
            const query = `
                INSERT INTO "announcements" 
                (class_id, visibility, title, content, file_name, file_link, professor_id, date)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *`;
                
            const values = [
                announcementData.classId,
                announcementData.visibility || 1, // Default visibility
                announcementData.title,
                announcementData.content,
                announcementData.fileName || null,
                announcementData.fileLink || null,
                announcementData.professorId,
                announcementData.date || new Date()
            ];
            
            const result = await client.query(query, values);
            
            if (result.rows.length === 0) {
                return new apiResponse(500, null, "Failed to create announcement");
            }
            
            console.log(`[AnnouncementModel] Successfully created announcement with ID: ${result.rows[0].id}`);
            
            return new apiResponse(201, result.rows[0], "Announcement created successfully");
        } catch (error) {
            console.error('[AnnouncementModel] Error creating announcement:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, error.message);
        } finally {
            client.release();
        }
    }

    // Get professor's published announcements
    async getProfessorAnnouncements(professorId) {
        console.log('\n[AnnouncementModel] Fetching announcements by professor:', {
            professorId,
            timestamp: new Date().toISOString()
        });
        
        const client = await this.pool.connect();
        
        try {
            const query = `
                SELECT a.*, c.name as class_name
                FROM "announcements" a
                JOIN "Class" c ON a.class_id = c.id
                WHERE a.professor_id = $1
                ORDER BY a.date DESC`;
                
            const result = await client.query(query, [professorId]);
            
            console.log(`[AnnouncementModel] Found ${result.rows.length} announcements by professor`);
            
            return new apiResponse(200, result.rows, "Professor announcements fetched successfully");
        } catch (error) {
            console.error('[AnnouncementModel] Error fetching professor announcements:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "An internal server error occurred");
        } finally {
            client.release();
        }
    }
}

export default AnnouncementModel;