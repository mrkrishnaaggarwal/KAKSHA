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

    async cancelClass(classId, subject, date) {
        console.log(`[ClassCancelledModel] Cancelling class for class ${classId}, subject ${subject}, date ${date}`);
        
        const client = await this.pool.connect();
        try {
            // First, find the timetable entry
            // We need to get the day name from the date
            const dayQuery = `SELECT TRIM(TO_CHAR(DATE '${date}', 'Day')) as day_name`;
            const dayResult = await client.query(dayQuery);
            const dayOfWeek = dayResult.rows[0].day_name;
            
            console.log(`[ClassCancelledModel] Day of week for ${date} is ${dayOfWeek}`);

            // Get the timetable entry that matches the class, subject, and day
            const timetableQuery = `
                SELECT id 
                FROM "TimeTable" 
                WHERE class_id = $1 
                AND LOWER(subject) = LOWER($2) 
                AND LOWER(day_of_the_week) = LOWER($3)
            `;
            
            const timetableResult = await client.query(timetableQuery, [classId, subject, dayOfWeek]);
            
            if (timetableResult.rows.length === 0) {
                return new apiResponse(404, null, `No timetable entry found for class ${classId}, subject ${subject} on ${dayOfWeek}`);
            }
            
            const timeTableId = timetableResult.rows[0].id;
            
            // Check if this class is already cancelled on this date
            const checkQuery = `
                SELECT id FROM "class_cancelled" 
                WHERE time_table_id = $1 AND date = $2
            `;
            
            const checkResult = await client.query(checkQuery, [timeTableId, date]);
            
            if (checkResult.rows.length > 0) {
                return new apiResponse(409, null, "This class is already cancelled on this date");
            }
            
            // Insert the cancelled class entry
            const insertQuery = `
                INSERT INTO "class_cancelled" (date, time_table_id)
                VALUES ($1, $2)
                RETURNING id
            `;
            
            const insertResult = await client.query(insertQuery, [date, timeTableId]);
            
            console.log(`[ClassCancelledModel] Class cancelled successfully with ID ${insertResult.rows[0].id}`);
            
            return new apiResponse(201, {
                id: insertResult.rows[0].id,
                date,
                timeTableId
            }, "Class cancelled successfully");
            
        } catch (error) {
            console.error('[ClassCancelledModel] Error:', error);
            return new apiResponse(500, null, "Database error occurred");
        } finally {
            client.release();
        }
    }
}

export default ClassCancelledModel;