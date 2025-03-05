import pg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import apiResponse from '../utils/apiResponse.js';
import ResultModel from './resultModel.js';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;

class StudentModel {
    constructor() {
        console.log("Checking constructor");
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        });
        this.resultModel = new ResultModel();
    }
    async getStudentProfile(studentId) {
        console.log('\n[ProfileModel] Fetching profile for student ID:', studentId);
        
        const client = await this.pool.connect();
        
        try {
            const query = `
                SELECT 
                    s.id, 
                    s.roll_no, 
                    s.first_name, 
                    s.last_name, 
                    s.email, 
                    s.class_id, 
                    c.name AS class_name,
                    s.semester, 
                    s.batch, 
                    s.dob, 
                    s.address,
                    CASE WHEN s.photo IS NULL THEN false ELSE true END AS has_photo
                FROM 
                    "Student" s
                LEFT JOIN 
                    "Class" c ON s.class_id = c.id
                WHERE 
                    s.id = $1`;
                
            const result = await client.query(query, [studentId]);
            
            if (result.rows.length === 0) {
                console.log('[ProfileModel] Student not found');
                return new apiResponse(404, null, "Student not found");
            }
            
            console.log('[ProfileModel] Profile fetched successfully');
            return new apiResponse(200, result.rows[0], "Profile fetched successfully");
        } catch (error) {
            console.error('[ProfileModel] Error fetching profile:', error);
            return new apiResponse(500, null, "Database error occurred");
        } finally {
            client.release();
        }
    }

    async updateStudentProfile(studentId, profileData) {
        console.log('\n[ProfileModel] Updating profile for student ID:', studentId);
        console.log(profileData);
        const client = await this.pool.connect();
        
        try {
            // Start a transaction
            await client.query('BEGIN');
            
            // Build the SET part of the query dynamically based on provided fields
            const updateFields = [];
            const values = [];
            let paramIndex = 1;
            
            // Add each field that's present in profileData
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
            
            // Add student ID at the end of values array
            values.push(studentId);
            
            if (updateFields.length === 0) {
                await client.query('ROLLBACK');
                return new apiResponse(400, null, "No fields to update");
            }
            
            const query = `
                UPDATE "Student"
                SET ${updateFields.join(', ')}
                WHERE id = $${paramIndex}
                RETURNING id, roll_no, first_name, last_name, email, class_id, semester, batch, dob, address`;
                
            const result = await client.query(query, values);
            
            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return new apiResponse(404, null, "Student not found");
            }
            
            // Commit the transaction
            await client.query('COMMIT');
            
            console.log('[ProfileModel] Profile updated successfully');
            return new apiResponse(200, result.rows[0], "Profile updated successfully");
        } catch (error) {
            // Rollback in case of error
            await client.query('ROLLBACK');
            console.error('[ProfileModel] Error updating profile:', error);
            return new apiResponse(500, null, "Database error occurred");
        } finally {
            client.release();
        }
    }
    async login(email, password) {
        const startTime = Date.now();
        console.log('\n[StudentModel] Login attempt:', {
            email,
            timestamp: new Date().toISOString()
        });

        const client = await this.pool.connect();

        try {
            console.log('[StudentModel] Searching for student in database...');
            const query = `SELECT * FROM "Student" WHERE email = $1`;
            const result = await client.query(query, [email.toLowerCase()]);
            const student = result.rows[0];

            if (!student) {
                console.log('[StudentModel] Student not found');
                return new apiResponse(401, null, "Invalid email or password");
            }

            console.log('[StudentModel] Verifying password...');
            const isValidPassword = await bcrypt.compare(password, student.password);

            if (!isValidPassword) {
                console.log('[StudentModel] Invalid password');
                return new apiResponse(401, null, "Invalid email or password");
            }

            console.log('[StudentModel] Password verified, generating tokens');
            const { password: _, ...studentData } = student;

            const tokens = {
                accessToken: jwt.sign(
                    { id: student.id },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1m' }
                ),
                refreshToken: jwt.sign(
                    { id: student.id },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '7d' }
                )
            };

            const duration = Date.now() - startTime;
            console.log(`[StudentModel] Login successful (${duration}ms)`);
            return new apiResponse(200, { student: studentData, tokens }, "Login successful");

        } catch (error) {
            console.error('[StudentModel] Login error:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "An internal server error occurred");
        } finally {
            client.release();
        }
    }

    async refresh(refreshToken) {
        console.log('\n[StudentModel] Token refresh attempt:', {
            tokenExists: !!refreshToken,
            timestamp: new Date().toISOString()
        });

        try {
            if (!refreshToken) {
                console.log('[StudentModel] No refresh token provided');
                return new apiResponse(403, null, "Refresh token not provided");
            }

            console.log('[StudentModel] Verifying refresh token...');
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            console.log('[StudentModel] Generating new access token...');
            const accessToken = jwt.sign(
                { id: decoded.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '2m' }
            );

            console.log('[StudentModel] Access token generated successfully');
            return new apiResponse(200, { accessToken }, "Token refreshed successfully");
        } catch (error) {
            console.error('[StudentModel] Token refresh error:', {
                error: error.message,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(403, null, "Invalid refresh token");
        }
    }


    async getClassId(studentId) {
        console.log('\n[StudentModel] Fetching ClassId:', {
            studentId,
            timestamp: new Date().toISOString()
        });
        const client = await this.pool.connect();
        try {
            // First get the student's class
            const query = `SELECT class_id FROM "Student" WHERE id = $1`;
            const result = await client.query(query, [studentId]);
            if (result.rows.length === 0) {
                return new apiResponse(404, null, "Student not found");
            }
            const classId = result.rows[0].class_id;
            return classId;
        }
        catch(error){
            console.error('[StudentModel] Error fetching classId:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "An internal server error occurred");
        }
        finally{
            client.release();
        }
    }
    async processResults(results) {
        const client = await this.pool.connect();
        try {
            const rollNumbers = [...new Set(results.map(r => r.roll_number))];
            
            const studentQuery = 'SELECT id, roll_no FROM "Student" WHERE roll_no = ANY($1)';
            const studentResult = await client.query(studentQuery, [rollNumbers]);
            const students = studentResult.rows;

            const rollToId = students.reduce((map, student) => {
                map[student.roll_no] = student.id;
                return map;
            }, {});

            const transformedResults = results.map(result => ({
                studentId: rollToId[result.roll_number],
                exam: result.exam,
                subject: result.subject,
                date: result.date,
                marks: result.marks,
                totalMarks: result.totalMarks,
                semester: result.semester
            }));

            const missingStudents = results.filter(r => !rollToId[r.roll_number])
                                         .map(r => r.roll_number);
            
            if (missingStudents.length > 0) {
                throw new Error(`Students not found: ${missingStudents.join(', ')}`);
            }

            return transformedResults;
        } catch (error) {
            console.error('[ResultModel] Process results error:', error);
            throw error;
        } finally {
            client.release();
        }
    }

}

export default StudentModel;
