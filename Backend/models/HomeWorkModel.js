import pg from 'pg';
import dotenv from 'dotenv';
import apiResponse from '../utils/apiResponse.js';

dotenv.config();
const { Pool } = pg;

class HomeWorkModel {
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

    async getHomeworkByClassId(classId, filters = {}) {
        console.log('\n[HomeWorkModel] Fetching homework for class:', {
            classId,
            filters,
            timestamp: new Date().toISOString()
        });
        
        const client = await this.pool.connect();
        
        try {
            let query = `
                SELECT h.*, 
                       p.first_name, p.last_name,
                       s.id as submission_id, s.status as submission_status, s.marks as submission_marks
                FROM "Homework" h
                JOIN "Professor" p ON h.professor_id = p.id
                LEFT JOIN "Submission" s ON h.id = s.hw_id AND s.student_id = $2
                WHERE h.class_id = $1`;
            
            const queryParams = [classId, filters.studentId];
            let paramCount = 3;
            
            // Add filtering options
            if (filters.status) {
                // Filter by submission status (submitted, pending, graded)
                if (filters.status === 'submitted') {
                    query += ` AND s.id IS NOT NULL`;
                } else if (filters.status === 'pending') {
                    query += ` AND (s.id IS NULL AND h.submission_date >= CURRENT_DATE)`;
                } else if (filters.status === 'overdue') {
                    query += ` AND (s.id IS NULL AND h.submission_date < CURRENT_DATE)`;
                } else if (filters.status === 'graded') {
                    query += ` AND s.marks IS NOT NULL`;
                }
            }
            
            // Add date range filter
            if (filters.dateFrom) {
                query += ` AND h.publish_date >= $${paramCount}`;
                queryParams.push(filters.dateFrom);
                paramCount++;
            }
            
            if (filters.dateTo) {
                query += ` AND h.publish_date <= $${paramCount}`;
                queryParams.push(filters.dateTo);
                paramCount++;
            }
            
            // Add sorting
            query += ` ORDER BY h.submission_date ASC`;
            
            const result = await client.query(query, queryParams);
            
            console.log(`[HomeWorkModel] Found ${result.rows.length} homework assignments`);
            
            // Process the data for frontend
            const processedHomework = result.rows.map(hw => ({
                id: hw.id,
                title: hw.title,
                content: hw.content,
                publishDate: hw.publish_date,
                submissionDate: hw.submission_date,
                professor: `${hw.first_name} ${hw.last_name}`,
                totalMarks: hw.total_marks,
                fileLink: hw.file_link,
                fileName: hw.file_name,
                submission: hw.submission_id ? {
                    id: hw.submission_id,
                    status: hw.submission_status,
                    marks: hw.submission_marks
                } : null
            }));
            
            return new apiResponse(200, processedHomework, "Homework fetched successfully");
        } catch (error) {
            console.error('[HomeWorkModel] Error fetching homework:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "An internal server error occurred");
        } finally {
            client.release();
        }
    }
    
    async getHomeworkDetails(homeworkId, studentId) {
        console.log('\n[HomeWorkModel] Fetching homework details:', {
            homeworkId,
            studentId,
            timestamp: new Date().toISOString()
        });
        
        const client = await this.pool.connect();
        
        try {
            const query = `
                SELECT h.*, 
                       p.first_name, p.last_name,
                       s.id as submission_id, s.content as submission_content, 
                       s.file_name as submission_file_name, s.file_link as submission_file_link,
                       s.status as submission_status, s.marks as submission_marks
                FROM "Homework" h
                JOIN "Professor" p ON h.professor_id = p.id
                LEFT JOIN "Submission" s ON h.id = s.hw_id AND s.student_id = $2
                WHERE h.id = $1`;
            
            const result = await client.query(query, [homeworkId, studentId]);
            
            if (result.rows.length === 0) {
                return new apiResponse(404, null, "Homework not found");
            }
            
            const hw = result.rows[0];
            const homeworkDetails = {
                id: hw.id,
                title: hw.title,
                content: hw.content,
                publishDate: hw.publish_date,
                submissionDate: hw.submission_date,
                professor: `${hw.first_name} ${hw.last_name}`,
                totalMarks: hw.total_marks,
                fileLink: hw.file_link,
                fileName: hw.file_name,
                submission: hw.submission_id ? {
                    id: hw.submission_id,
                    content: hw.submission_content,
                    fileName: hw.submission_file_name,
                    fileLink: hw.submission_file_link,
                    status: hw.submission_status,
                    marks: hw.submission_marks
                } : null
            };
            
            return new apiResponse(200, homeworkDetails, "Homework details fetched successfully");
        } catch (error) {
            console.error('[HomeWorkModel] Error fetching homework details:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "An internal server error occurred");
        } finally {
            client.release();
        }
    }

    async createHomework(homeworkData) {
        console.log('\n[HomeWorkModel] Creating new homework assignment:', {
            title: homeworkData.title,
            professorId: homeworkData.professorId,
            classId: homeworkData.classId,
            timestamp: new Date().toISOString()
        });
        
        const client = await this.pool.connect();
        
        try {
            const query = `
                INSERT INTO "Homework" (
                    title, content, publish_date, submission_date, 
                    professor_id, class_id, file_name, file_link, total_marks
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *`;
            
            const values = [
                homeworkData.title,
                homeworkData.content,
                homeworkData.publishDate || new Date(),
                homeworkData.submissionDate,
                homeworkData.professorId,
                homeworkData.classId,
                homeworkData.fileName || null,
                homeworkData.fileLink || null,
                homeworkData.totalMarks || 100
            ];
            
            const result = await client.query(query, values);
            
            if (result.rows.length === 0) {
                return new apiResponse(500, null, "Failed to create homework assignment");
            }
            
            console.log('[HomeWorkModel] Homework created successfully:', {
                id: result.rows[0].id,
                title: result.rows[0].title
            });
            
            return new apiResponse(201, result.rows[0], "Homework assignment created successfully");
        } catch (error) {
            console.error('[HomeWorkModel] Error creating homework:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "An internal server error occurred");
        } finally {
            client.release();
        }
    }
    
    async getProfessorClasses(professorId) {
        console.log('\n[HomeWorkModel] Getting professor classes:', {
            professorId,
            timestamp: new Date().toISOString()
        });
        
        const client = await this.pool.connect();
        
        try {
            const query = `
                SELECT c.id, c.name
                FROM "Class" c
                JOIN "professor_class" pc ON c.id = pc.class_id
                WHERE pc.professor_id = $1
                ORDER BY c.name`;
            
            const result = await client.query(query, [professorId]);
            
            console.log(`[HomeWorkModel] Found ${result.rows.length} classes for professor`);
            
            return new apiResponse(200, result.rows, "Classes fetched successfully");
        } catch (error) {
            console.error('[HomeWorkModel] Error fetching professor classes:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "An internal server error occurred");
        } finally {
            client.release();
        }
    }
    
    async getProfessorHomework(professorId) {
        console.log('\n[HomeWorkModel] Getting professor homework:', {
            professorId,
            timestamp: new Date().toISOString()
        });
        
        const client = await this.pool.connect();
        
        try {
            const query = `
                SELECT h.*, c.name as class_name
                FROM "Homework" h
                JOIN "Class" c ON h.class_id = c.id
                WHERE h.professor_id = $1
                ORDER BY h.publish_date DESC`;
            
            const result = await client.query(query, [professorId]);
            
            console.log(`[HomeWorkModel] Found ${result.rows.length} homework assignments for professor`);
            
            // Process the data for frontend
            const processedHomework = result.rows.map(hw => ({
                id: hw.id,
                title: hw.title,
                content: hw.content,
                publishDate: hw.publish_date,
                submissionDate: hw.submission_date,
                className: hw.class_name,
                totalMarks: hw.total_marks,
                fileLink: hw.file_link,
                fileName: hw.file_name
            }));
            
            return new apiResponse(200, processedHomework, "Homework assignments fetched successfully");
        } catch (error) {
            console.error('[HomeWorkModel] Error fetching professor homework:', {
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

export default HomeWorkModel;