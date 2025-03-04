import pg from 'pg';
import apiResponse from '../utils/apiResponse.js';

const { Pool } = pg;

class AttendanceModel {
    constructor() {
        console.log('[AttendanceModel] Initializing model');
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        });
        console.log('[AttendanceModel] Database connection pool created');
    }

    async getDayAttendance(studentId, date) {
        console.log('\n[AttendanceModel] Fetching day attendance:', { studentId, date });
        const client = await this.pool.connect();
        try {
            const query = `
                SELECT 
                    a.status, 
                    t.subject
                FROM 
                    "Attendance" a
                INNER JOIN 
                    "TimeTable" t ON a.time_table_id = t.id
                WHERE 
                    a.student_id = $1
                    AND a.date = $2
                ORDER BY 
                    t.start_time ASC
            `;
            
            const result = await client.query(query, [studentId, date]);
            
            return new apiResponse(200, result.rows, "Day attendance retrieved successfully");
        } catch (error) {
            console.error('[AttendanceModel] Error fetching day attendance:', {
                error: error.message,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "Error retrieving day attendance");
        } finally {
            client.release();
        }
    }

    async getAttendance(studentId) {
        console.log('\n[AttendanceModel] Fetching attendance:', { studentId });
        const client = await this.pool.connect();
        try {
            const query = `
                SELECT 
                  t.subject,
                  COUNT(*) AS total_classes,
                  COUNT(CASE WHEN lower(a.status) = 'present' THEN 1 END) AS present_count
                FROM 
                  "Attendance" a
                INNER JOIN 
                  "TimeTable" t ON a.time_table_id = t.id
                WHERE 
                  a.student_id = $1
                GROUP BY 
                  t.subject
            `;
            
            const result = await client.query(query, [studentId]);
            
            return new apiResponse(200, result.rows, "Attendance retrieved successfully");
        } catch (error) {
            console.error('[AttendanceModel] Error fetching attendance:', {
                error: error.message,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "Error retrieving attendance");
        } finally {
            client.release();
        }
    }
}

export default AttendanceModel;