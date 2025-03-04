import pg from 'pg';

const {Pool} = pg;
import apiResponse from '../utils/apiResponse.js';

class ResultModel {
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        });
        console.log('[ResultModel] Initialized with PostgreSQL pool');
    }

    async getStudentResults(studentId, filters = {}) {
        console.log('\n[ResultModel] Fetching results:', { studentId, filters });
        const client = await this.pool.connect();
        try {
            let query = 'SELECT * FROM "results" WHERE student_id = $1';
            const params = [studentId];
            let paramIndex = 2;

            // Apply filters
            const filterConditions = [];
            if (filters.semester) {
                filterConditions.push(`semester = $${paramIndex}`);
                params.push(filters.semester);
                paramIndex++;
            }
            if (filters.exam) {
                filterConditions.push(`exam = $${paramIndex}`);
                params.push(filters.exam);
                paramIndex++;
            }
            if (filters.subject) {
                filterConditions.push(`subject = $${paramIndex}`);
                params.push(filters.subject);
                paramIndex++;
            }

            if (filterConditions.length > 0) {
                query += ' AND ' + filterConditions.join(' AND ');
            }

            query += ' ORDER BY date DESC';

            const result = await client.query(query, params);
            const results = result.rows;

            // Calculate statistics
            const stats = results.length > 0 ? {
                totalMarksObtained: results.reduce((sum, r) => sum + r.marks, 0),
                totalMaxMarks: results.reduce((sum, r) => sum + r.total_marks, 0),
                averagePercentage: (results.reduce((sum, r) =>
                    sum + (r.marks / r.total_marks * 100), 0) / results.length).toFixed(2)
            } : null;

            return new apiResponse(200, { results, stats }, "Results retrieved successfully");
        } catch (error) {
            console.error('[ResultModel] Error fetching results:', error);
            return new apiResponse(500, null, "Error retrieving results");
        } finally {
            client.release();
        }
    }

    async uploadResults(results) {
        console.log(results);
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
        
            // Extract arrays for batch insert
            const studentIds = [];
            const exams = [];
            const subjects = [];
            const dates = [];
            const marks = [];
            const totalMarks = [];
            const semesters = [];
        
            for (const result of results) {
                studentIds.push(result.studentId);
                exams.push(result.exam);
                subjects.push(result.subject);
                dates.push(result.date);
                marks.push(result.marks);
                totalMarks.push(result.totalMarks);
                semesters.push(result.semester);
            }
        
            const insertQuery = `
                INSERT INTO "results" (student_id, exam, subject, date, marks, total_marks, semester)
                SELECT * FROM UNNEST(
                    $1::text[], $2::text[], $3::text[], $4::date[], $5::int[], $6::int[], $7::int[]
                )
                ON CONFLICT (student_id, exam, subject, date) DO NOTHING;
            `;
        
            await client.query(insertQuery, [
                studentIds, exams, subjects, dates, marks, totalMarks, semesters
            ]);
        
            await client.query('COMMIT');
            return new apiResponse(200, { count: results.length }, "Results uploaded successfully");
        
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('[ResultModel] Upload failed:', error);
            throw error;
        } finally {
            client.release();
        }
        
    }

    async getSemesterResults(studentId, semester) {
        console.log('\n[ResultModel] Fetching semester results:', { studentId, semester });
        const client = await this.pool.connect();
        try {
            const query = `
                SELECT r.*, s.first_name, s.last_name, s.roll_no 
                FROM results r
                JOIN students s ON r.student_id = s.id
                WHERE r.student_id = $1 AND r.semester = $2
                ORDER BY r.subject ASC`;
            
            const result = await client.query(query, [studentId, semester]);
            const results = result.rows;

            const groupedResults = results.reduce((acc, result) => {
                if (!acc[result.exam]) acc[result.exam] = [];
                acc[result.exam].push(result);
                return acc;
            }, {});

            return new apiResponse(200, groupedResults, "Semester results retrieved successfully");
        } catch (error) {
            console.error('[ResultModel] Error fetching semester results:', error);
            return new apiResponse(500, null, "Error retrieving semester results");
        } finally {
            client.release();
        }
    }

    async getExamResults(studentId, examType) {
        console.log('\n[ResultModel] Fetching exam results:', { studentId, examType });
        const client = await this.pool.connect();
        try {
            const query = 'SELECT * FROM results WHERE student_id = $1 AND exam = $2 ORDER BY semester DESC';
            const result = await client.query(query, [studentId, examType]);
            const results = result.rows;

            const totalScore = results.reduce((sum, r) => sum + r.marks, 0);
            const maxScore = results.reduce((sum, r) => sum + r.total_marks, 0);
            const percentage = maxScore > 0 ? (totalScore / maxScore * 100).toFixed(2) : 0;

            return new apiResponse(200, {
                results,
                summary: { totalScore, maxScore, percentage }
            }, "Exam results retrieved successfully");
        } catch (error) {
            console.error('[ResultModel] Error fetching exam results:', error);
            return new apiResponse(500, null, "Error retrieving exam results");
        } finally {
            client.release();
        }
    }
}

export default ResultModel;