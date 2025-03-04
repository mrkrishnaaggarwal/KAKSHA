import pg from 'pg';
import apiResponse from '../utils/apiResponse.js';
const {Pool} = pg;

class TimeTableModel{
    constructor(){
        console.log("Checking Time Table constructor");
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        });
    }

    async getTimeTable(classId) {
        const client = await this.pool.connect();
        try {
            const TimeTablequery = `
                SELECT t.id, t.class_id, t.subject, t.room,
                t.professor_id,
                p.first_name, p.last_name,
                t.day_of_the_week AS "dayOfTheWeek",
                t.start_time AS "startTime",
                t.end_time AS "endTime"
                FROM "TimeTable" t
                JOIN "Professor" p ON t.professor_id = p.id
                WHERE t.class_id = $1
                ORDER BY t.day_of_the_week ASC, t.start_time ASC;
            `;
            
            const timeTableResult = await client.query(TimeTablequery,[classId]);
            // Group by day of the week
            const groupedTimetable = timeTableResult.rows.reduce((acc, entry) => {
                if (!acc[entry.dayOfTheWeek]) {
                    acc[entry.dayOfTheWeek] = [];
                }
                acc[entry.dayOfTheWeek].push({
                    subject: entry.subject,
                    startTime: entry.startTime,
                    endTime: entry.endTime,
                    room: entry.room,
                    professor: `${entry.first_name} ${entry.last_name}`
                });
                return acc;
            }, {});

            return new apiResponse(200, groupedTimetable, "Timetable retrieved successfully");
        } catch (error) {
            console.error('[TimeTableModel] Get timetable error:', {
                error: error.message,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "An internal server error occurred");
        }
        finally{
            client.release();
        }
    }
    async getProfessorTimeTable(professorId) {
        console.log(`[TimeTableModel] Fetching timetable for professor ID: ${professorId}`);
        
        const client = await this.pool.connect();
        
        try {
            const query = `
                SELECT 
                    tt.id,
                    tt.day_of_the_week,
                    tt.start_time,
                    tt.end_time,
                    tt.subject,
                    tt.room,
                    c.name as class_name,
                    c.id as class_id
                FROM 
                    "TimeTable" tt
                JOIN 
                    "Class" c ON tt.class_id = c.id
                WHERE 
                    tt.professor_id = $1
                ORDER BY 
                    CASE 
                        WHEN LOWER(tt.day_of_the_week) = 'monday' THEN 1
                        WHEN LOWER(tt.day_of_the_week) = 'tuesday' THEN 2
                        WHEN LOWER(tt.day_of_the_week) = 'wednesday' THEN 3
                        WHEN LOWER(tt.day_of_the_week) = 'thursday' THEN 4
                        WHEN LOWER(tt.day_of_the_week) = 'friday' THEN 5
                        WHEN LOWER(tt.day_of_the_week) = 'saturday' THEN 6
                        WHEN LOWER(tt.day_of_the_week) = 'sunday' THEN 7
                        ELSE 8
                    END,
                    tt.start_time
            `;
            
            const result = await client.query(query, [professorId]);
            
            console.log(`[TimeTableModel] Found ${result.rows.length} timetable entries`);
            
            return new apiResponse(200, result.rows, "Professor timetable fetched successfully");
        } catch (error) {
            console.error('[TimeTableModel] Error fetching professor timetable:', error);
            return new apiResponse(500, null, "Database error occurred");
        } finally {
            client.release();
        }
    }
}

export default TimeTableModel;