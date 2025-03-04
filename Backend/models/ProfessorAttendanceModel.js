import pg from 'pg';
import apiResponse from '../utils/apiResponse.js';

const { Pool } = pg;

class ProfessorAttendanceModel {
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

    async getClassesOnDate(professorId, date) {
        console.log(`[ProfessorAttendanceModel] Getting classes for professor ID ${professorId} on date ${date}`);
        const client = await this.pool.connect();
        
        try {
            // Get day name from date (e.g., 'Monday', 'Tuesday', etc.)
            const dayQuery = `SELECT TRIM(TO_CHAR(DATE '${date}', 'Day')) as day_name`;
            const dayResult = await client.query(dayQuery);
            const dayOfWeek = dayResult.rows[0].day_name;
            
            console.log(`[ProfessorAttendanceModel] Day of week for ${date} is ${dayOfWeek}`);
            
            // Get all classes that the professor teaches on this day of the week
            const query = `
                SELECT 
                    tt.id as timetable_id,
                    tt.class_id,
                    c.name as class_name,
                    tt.subject,
                    tt.room,
                    tt.start_time,
                    tt.end_time
                FROM 
                    "TimeTable" tt
                JOIN 
                    "Class" c ON tt.class_id = c.id
                WHERE 
                    tt.professor_id = $1 AND
                    LOWER(tt.day_of_the_week) = LOWER($2) AND
                    NOT EXISTS (
                        SELECT 1 FROM "class_cancelled" cc
                        WHERE cc.time_table_id = tt.id AND cc.date = $3
                    )
                ORDER BY 
                    tt.start_time
            `;
            
            const result = await client.query(query, [professorId, dayOfWeek, date]);
            
            console.log(`[ProfessorAttendanceModel] Found ${result.rows.length} classes for professor on ${date}`);
            
            return new apiResponse(200, result.rows, "Classes fetched successfully");
        } catch (error) {
            console.error('[ProfessorAttendanceModel] Error getting classes:', error);
            return new apiResponse(500, null, "Database error occurred");
        } finally {
            client.release();
        }
    }

    async getStudentsInClass(classId) {
        console.log(`[ProfessorAttendanceModel] Getting students for class ID ${classId}`);
        const client = await this.pool.connect();
        
        try {
            const query = `
                SELECT 
                    s.id,
                    s.roll_no,
                    s.first_name,
                    s.last_name,
                    s.email,
                    s.semester,
                    s.batch
                FROM 
                    "Student" s
                WHERE 
                    s.class_id = $1
                ORDER BY
                    s.roll_no
            `;
            
            const result = await client.query(query, [classId]);
            
            console.log(`[ProfessorAttendanceModel] Found ${result.rows.length} students in class ${classId}`);
            
            return new apiResponse(200, result.rows, "Students fetched successfully");
        } catch (error) {
            console.error('[ProfessorAttendanceModel] Error getting students:', error);
            return new apiResponse(500, null, "Database error occurred");
        } finally {
            client.release();
        }
    }

    async markAttendance(timeTableId, date, attendanceData) {
        console.log(`[ProfessorAttendanceModel] Marking attendance for timetable ${timeTableId} on ${date}`);
        const client = await this.pool.connect();
        
        try {
            // Start transaction
            await client.query('BEGIN');
            
            const insertedRecords = [];
            const errors = [];
            
            // Process each student's attendance
            for (const record of attendanceData) {
                try {
                    // Check if attendance record already exists
                    const checkQuery = `
                        SELECT id FROM "Attendance"
                        WHERE student_id = $1 AND time_table_id = $2 AND date = $3
                    `;
                    
                    const checkResult = await client.query(checkQuery, [
                        record.studentId,
                        timeTableId,
                        date
                    ]);
                    
                    if (checkResult.rows.length > 0) {
                        // Update existing record
                        const updateQuery = `
                            UPDATE "Attendance"
                            SET status = $1
                            WHERE student_id = $2 AND time_table_id = $3 AND date = $4
                            RETURNING id, student_id, status
                        `;
                        
                        const updateResult = await client.query(updateQuery, [
                            record.status,
                            record.studentId,
                            timeTableId,
                            date
                        ]);
                        
                        insertedRecords.push(updateResult.rows[0]);
                    } else {
                        // Insert new record
                        const insertQuery = `
                            INSERT INTO "Attendance" (student_id, time_table_id, date, status)
                            VALUES ($1, $2, $3, $4)
                            RETURNING id, student_id, status
                        `;
                        
                        const insertResult = await client.query(insertQuery, [
                            record.studentId,
                            timeTableId,
                            date,
                            record.status
                        ]);
                        
                        insertedRecords.push(insertResult.rows[0]);
                    }
                } catch (err) {
                    console.error(`[ProfessorAttendanceModel] Error processing student ${record.studentId}:`, err);
                    errors.push({
                        studentId: record.studentId,
                        error: err.message
                    });
                }
            }
            
            // If any errors occurred, rollback
            if (errors.length > 0) {
                await client.query('ROLLBACK');
                console.error(`[ProfessorAttendanceModel] Errors occurred during attendance marking, rolling back`);
                return new apiResponse(400, { errors }, "Some attendance records could not be processed");
            }
            
            // Commit transaction
            await client.query('COMMIT');
            
            console.log(`[ProfessorAttendanceModel] Successfully marked attendance for ${insertedRecords.length} students`);
            
            return new apiResponse(200, {
                timeTableId,
                date,
                markedRecords: insertedRecords.length
            }, "Attendance marked successfully");
            
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('[ProfessorAttendanceModel] Error marking attendance:', error);
            return new apiResponse(500, null, "Database error occurred");
        } finally {
            client.release();
        }
    }
    async getTeachingClasses(professorId) {
        console.log(`[ProfessorAttendanceModel] Getting teaching classes for professor ${professorId}`);
        
        const client = await this.pool.connect();
        
        try {
            const query = `
                SELECT DISTINCT 
                    c.id,
                    c.name,
                    c.class_teacher,
                    pc.subject,
                    (
                        SELECT COUNT(*)
                        FROM "Student" s
                        WHERE s.class_id = c.id
                    ) as student_count
                FROM "Class" c
                JOIN "professor_class" pc ON c.id = pc.class_id
                WHERE pc.professor_id = $1
                ORDER BY c.name ASC;
            `;
            
            const result = await client.query(query, [professorId]);
            
            console.log(`[ProfessorAttendanceModel] Found ${result.rows.length} classes`);
            
            return new apiResponse(200, result.rows, "Classes fetched successfully");
        } catch (error) {
            console.error('[ProfessorAttendanceModel] Error:', error);
            return new apiResponse(500, null, "Database error occurred");
        } finally {
            client.release();
        }
    }
}

export default ProfessorAttendanceModel;