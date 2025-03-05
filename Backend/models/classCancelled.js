import pg from 'pg';
import apiResponse from '../utils/apiResponse.js';
const { Pool } = pg;

class ClassCancelledModel {
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

    async getCancelledClasses(classId) {
        const client = await this.pool.connect();
        try {
            const query = `
                SELECT cc.date, tt.subject, tt.start_time, tt.end_time 
                FROM class_cancelled cc
                JOIN "TimeTable" tt ON cc.time_table_id = tt.id
                WHERE tt.class_id = $1;
            `;
            const result = await client.query(query, [classId]);
            return new apiResponse(200, result.rows, "Cancelled classes retrieved successfully");
        } catch (error) {
            console.error('[ClassCancelledModel] Error:', error);
            return new apiResponse(500, null, "Database error occurred");
        } finally {
            client.release();
        }
    }
}

export default ClassCancelledModel;