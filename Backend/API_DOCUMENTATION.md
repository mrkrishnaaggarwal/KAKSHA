# KAKSHA Backend API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication System](#authentication-system)
4. [Student APIs](#student-apis)
5. [Professor APIs](#professor-apis)
6. [Profile Management APIs](#profile-management-apis)
7. [Class Management APIs](#class-management-apis)
8. [API Flow Patterns](#api-flow-patterns)
9. [Error Handling](#error-handling)
10. [Possible Improvements](#possible-improvements)

## Overview

KAKSHA is a comprehensive school management system backend built with Node.js, Express.js, and PostgreSQL. The system provides separate interfaces for students and professors with role-based access control.

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (Access + Refresh Token)
- **File Upload**: Multer
- **Validation**: Joi
- **Password Hashing**: bcrypt

### Base URL
All APIs are prefixed with `/api/v1`

## Architecture

The project follows a clean MVC (Model-View-Controller) architecture:

```
Routes → Middleware → Controllers → Services → Models → Database
```

### Directory Structure
```
Backend/
├── routes/           # Route definitions
├── controller/       # Request handlers
├── services/         # Business logic layer
├── models/          # Database access layer
├── middleware/      # Authentication & other middleware
├── utils/           # Utility functions
└── config/          # Configuration files
```

## Authentication System

### Overview
The system uses JWT-based authentication with two types of tokens:
- **Access Token**: Short-lived (used for API authentication)
- **Refresh Token**: Long-lived (stored as HTTP-only cookie)

### Authentication Flow

#### 1. Login Process
```
Client → Login Request → Validation → Database Check → Generate Tokens → Return Access Token + Set Refresh Cookie
```

#### 2. Token Refresh Process
```
Client → Refresh Request → Validate Refresh Token → Generate New Access Token → Return New Token
```

#### 3. Request Authentication
```
Client → API Request (with Access Token) → Middleware Validation → Route Handler
```

### Middleware Components

#### AuthMiddleware.authenticate
- Validates access token from Authorization header
- Automatically attempts token refresh if token is expired
- Sets `req.user.id` for authenticated requests

#### AuthMiddleware.ensureNotAuthenticated
- Prevents authenticated users from accessing login/register routes
- Checks for both access token and refresh token

#### AuthMiddleware.refreshTokenMiddleware
- Handles refresh token validation
- Used specifically for token refresh endpoints

## Student APIs

### Base Path: `/api/v1/student`

### Authentication APIs

#### 1. Student Login
**Endpoint**: `POST /api/v1/student/login`
**Access**: Public
**Middleware**: `ensureNotAuthenticated`

**Request Body**:
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

**Validation Rules**:
- Email: Must be valid email format, required
- Password: Minimum 6 characters, required

**Flow**:
1. `studentRoutes.js` → receives request
2. `AuthMiddleware.ensureNotAuthenticated` → checks if user already authenticated
3. `StudentController.login` → handles request
4. `StudentService.login` → validates input using Joi
5. `StudentModel.login` → queries database, verifies password
6. Generate JWT tokens (access + refresh)
7. Set refresh token as HTTP-only cookie
8. Return access token in response

**Response**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "student@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### 2. Token Refresh
**Endpoint**: `POST /api/v1/student/refresh`
**Access**: Semi-public (requires refresh token cookie)
**Middleware**: `refreshTokenMiddleware`

**Flow**:
1. Extract refresh token from HTTP-only cookie
2. Validate refresh token
3. Generate new access token
4. Return new access token

**Response**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. Student Logout
**Endpoint**: `POST /api/v1/student/logout`
**Access**: Protected
**Middleware**: `authenticate`

**Flow**:
1. Validate access token
2. Clear refresh token cookie
3. Return success response

### Academic Data APIs

#### 4. Get Student Results
**Endpoint**: `GET /api/v1/student/results`
**Access**: Protected
**Middleware**: `authenticate`

**Query Parameters**:
- `semester` (optional): Filter by semester
- `exam` (optional): Filter by exam type
- `subject` (optional): Filter by subject

**Flow**:
1. Extract student ID from authenticated user
2. Parse query filters
3. `StudentService.getResults` → validates and processes request
4. `ResultModel.getStudentResults` → queries database with filters
5. Return formatted results

**Response**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Results fetched successfully",
  "data": [
    {
      "id": 1,
      "subject": "Mathematics",
      "semester": "1st",
      "exam_type": "Mid-term",
      "marks": 85,
      "total_marks": 100,
      "grade": "A"
    }
  ]
}
```

#### 5. Get Student Timetable
**Endpoint**: `GET /api/v1/student/timetable`
**Access**: Protected

**Flow**:
1. Extract student ID from token
2. `StudentModel.getClassId` → get student's class
3. `TimeTableModel.getTimeTable` → fetch class timetable
4. Return formatted timetable

**Response**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Timetable fetched successfully",
  "data": [
    {
      "day": "Monday",
      "time_slot": "09:00-10:00",
      "subject": "Mathematics",
      "professor": "Dr. Smith"
    }
  ]
}
```

#### 6. Get Day Attendance
**Endpoint**: `GET /api/v1/student/day-attendance`
**Access**: Protected

**Query Parameters**:
- `date` (optional): Date in YYYY-MM-DD format (defaults to today)

**Flow**:
1. Extract student ID and date parameter
2. `AttendanceModel.getDayAttendance` → query attendance for specific date
3. Return attendance records for the day

#### 7. Get Overall Attendance
**Endpoint**: `GET /api/v1/student/attendance`
**Access**: Protected

**Flow**:
1. Extract student ID from token
2. `AttendanceModel.getAttendance` → calculate overall attendance statistics
3. Return attendance summary with percentages

#### 8. Get Announcements
**Endpoint**: `GET /api/v1/student/announcement`
**Access**: Protected

**Flow**:
1. Extract student ID from token
2. `AnnouncementModel.getAnnouncements` → fetch announcements for student's class
3. Return list of announcements

### Homework APIs

#### 9. Get Homework List
**Endpoint**: `GET /api/v1/student/homework`
**Access**: Protected

**Query Parameters**:
- `status` (optional): Filter by status (pending, completed)
- `dateFrom` (optional): Start date filter
- `dateTo` (optional): End date filter

**Flow**:
1. Extract student ID and filters
2. `HomeWorkModel.getHomework` → query homework with filters
3. Return filtered homework list

#### 10. Get Homework Details
**Endpoint**: `GET /api/v1/student/homework/:id`
**Access**: Protected

**Flow**:
1. Extract homework ID from URL parameter
2. `HomeWorkModel.getHomeworkDetails` → fetch detailed homework information
3. Return complete homework details including attachments

### Other APIs

#### 11. Get Cancelled Classes
**Endpoint**: `GET /api/v1/student/cancelled-classes`
**Access**: Protected

**Flow**:
1. Extract student ID from token
2. `ClassCancelledModel.getCancelledClasses` → fetch cancelled classes for student
3. Return list of cancelled classes

#### 12. Test Protected Route
**Endpoint**: `GET /api/v1/student/protected`
**Access**: Protected

A simple endpoint to test authentication functionality.

## Professor APIs

### Base Path: `/api/v1/professor`

### Authentication APIs

#### 1. Professor Login
**Endpoint**: `POST /api/v1/professor/login`
**Access**: Public
**Middleware**: `ensureNotAuthenticated`

Similar flow to student login but uses `ProfessorModel` for database operations.

#### 2. Professor Token Refresh
**Endpoint**: `POST /api/v1/professor/refresh`
**Access**: Semi-public

#### 3. Professor Logout
**Endpoint**: `POST /api/v1/professor/logout`
**Access**: Protected

### Teaching Management APIs

#### 4. Upload Results
**Endpoint**: `POST /api/v1/professor/upload-results`
**Access**: Protected
**File Upload**: Single file (Excel format)
**Middleware**: `authenticate`, `upload.single('resultsFile')`

**Flow**:
1. Validate uploaded file (must be .xlsx format)
2. Parse Excel file using ExcelJS
3. Extract student results data
4. Bulk insert/update results in database
5. Return upload summary

**Request**: Multipart form data with Excel file

#### 5. Get Professor Classes
**Endpoint**: `GET /api/v1/professor/classes`
**Access**: Protected

**Flow**:
1. Extract professor ID from token
2. `HomeWorkModel.getProfessorClasses` → fetch classes taught by professor
3. Return list of classes with details

#### 6. Create Homework
**Endpoint**: `POST /api/v1/professor/homework`
**Access**: Protected

**Request Body**:
```json
{
  "title": "Math Assignment 1",
  "description": "Solve problems 1-10",
  "classId": 1,
  "subject": "Mathematics",
  "dueDate": "2024-01-15",
  "fileName": "assignment.pdf",
  "fileLink": "https://example.com/file"
}
```

**Flow**:
1. Validate homework data
2. `HomeWorkModel.createHomework` → insert homework record
3. Associate with specified class
4. Return created homework details

#### 7. Get Professor Homework
**Endpoint**: `GET /api/v1/professor/homework`
**Access**: Protected

**Flow**:
1. Extract professor ID from token
2. `HomeWorkModel.getProfessorHomework` → fetch homework created by professor
3. Return homework list with submission statistics

### Announcement APIs

#### 8. Create Announcement
**Endpoint**: `POST /api/v1/professor/announcements`
**Access**: Protected

**Request Body**:
```json
{
  "title": "Important Notice",
  "content": "Class will be postponed",
  "classId": 1,
  "priority": "high"
}
```

**Flow**:
1. Validate announcement data
2. `AnnouncementModel.createAnnouncement` → insert announcement
3. Associate with specified class
4. Return created announcement

#### 9. Get Professor Announcements
**Endpoint**: `GET /api/v1/professor/announcements`
**Access**: Protected

**Flow**:
1. Extract professor ID from token
2. `AnnouncementModel.getProfessorAnnouncements` → fetch professor's announcements
3. Return announcements list

### Attendance Management APIs

#### 10. Get Classes for Attendance (by Date)
**Endpoint**: `GET /api/v1/professor/attendance/classes`
**Access**: Protected

**Query Parameters**:
- `date` (required): Date in YYYY-MM-DD format

**Flow**:
1. Validate date parameter
2. `ProfessorAttendanceModel.getClassesOnDate` → fetch professor's classes for specific date
3. Return classes scheduled for that date

#### 11. Get Students in Class
**Endpoint**: `GET /api/v1/professor/attendance/class/:classId/students`
**Access**: Protected

**Flow**:
1. Extract class ID from URL parameter
2. Validate class access for professor
3. `ProfessorAttendanceModel.getStudentsInClass` → fetch student list
4. Return students enrolled in the class

#### 12. Mark Attendance
**Endpoint**: `POST /api/v1/professor/attendance/timetable/:timeTableId/mark`
**Access**: Protected

**Request Body**:
```json
{
  "date": "2024-01-10",
  "attendance": [
    {
      "studentId": 1,
      "status": "present"
    },
    {
      "studentId": 2,
      "status": "absent"
    }
  ]
}
```

**Flow**:
1. Validate timetable ID and date
2. Validate attendance array format
3. `ProfessorAttendanceModel.markAttendance` → bulk insert/update attendance records
4. Return marking summary

#### 13. Get Teaching Classes
**Endpoint**: `GET /api/v1/professor/teaching-classes`
**Access**: Protected

**Flow**:
1. Extract professor ID from token
2. `ProfessorAttendanceModel.getTeachingClasses` → fetch all classes taught by professor
3. Return comprehensive class list

#### 14. Get Class Attendance Report by Subject
**Endpoint**: `GET /api/v1/professor/attendance/class/:classId/subject-report`
**Access**: Protected

**Query Parameters**:
- `subject` (required): Subject name

**Flow**:
1. Extract class ID and subject
2. `ProfessorAttendanceModel.getClassAttendanceBySubject` → generate attendance report
3. Return detailed attendance statistics

#### 15. Get Subjects for Class
**Endpoint**: `GET /api/v1/professor/subjects/class/:classId`
**Access**: Protected

**Flow**:
1. Extract class ID from URL parameter
2. Validate professor teaches this class
3. `ProfessorAttendanceModel.getSubjectsForClass` → fetch subjects taught in class
4. Return subject list

### Timetable APIs

#### 16. Get Professor Timetable
**Endpoint**: `GET /api/v1/professor/timetable`
**Access**: Protected

**Flow**:
1. Extract professor ID from token
2. `ProfessorTimeTableModel.getProfessorTimeTable` → fetch professor's schedule
3. Return weekly timetable

### Class Management APIs

#### 17. Cancel Class
**Endpoint**: `POST /api/v1/professor/cancel-class`
**Access**: Protected

**Request Body**:
```json
{
  "classId": 1,
  "subject": "Mathematics",
  "date": "2024-01-10"
}
```

**Flow**:
1. Validate class cancellation data
2. `ClassCancelledModel.cancelClass` → record class cancellation
3. Notify students (if notification system exists)
4. Return cancellation confirmation

## Profile Management APIs

### Student Profile APIs

#### 1. Get Student Profile
**Endpoint**: `GET /api/v1/student/profile`
**Access**: Protected

**Flow**:
1. Extract student ID from token
2. `ProfileService.getProfile` → fetch student profile data
3. `StudentModel.getStudentProfile` → query database
4. Return profile information

#### 2. Update Student Profile
**Endpoint**: `PUT /api/v1/student/profile`
**Access**: Protected

**Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "address": "123 Main St",
  "phone": "123-456-7890"
}
```

**Flow**:
1. Validate profile data
2. `ProfileService.updateProfile` → process update
3. `StudentModel.updateProfile` → update database
4. Return updated profile

### Professor Profile APIs

#### 3. Get Professor Profile
**Endpoint**: `GET /api/v1/professor/profile`
**Access**: Protected

#### 4. Update Professor Profile
**Endpoint**: `PUT /api/v1/professor/profile`
**Access**: Protected

Similar flow to student profile management but uses `ProfessorModel`.

## API Flow Patterns

### Standard Request Flow
```
1. Client Request
   ↓
2. Route Matching (Express Router)
   ↓
3. Middleware Execution
   - CORS handling
   - Body parsing
   - Authentication (if required)
   ↓
4. Controller Method
   - Request validation
   - Extract parameters
   - Call service method
   ↓
5. Service Layer
   - Business logic
   - Data validation (Joi)
   - Call model methods
   ↓
6. Model Layer
   - Database connection
   - SQL query execution
   - Data formatting
   ↓
7. Response Generation
   - Standard apiResponse format
   - HTTP status codes
   - JSON response
```

### Error Handling Flow
```
1. Error Occurs (Any Layer)
   ↓
2. Catch Block
   - Log error details
   - Generate error response
   ↓
3. Standard Error Response
   {
     "success": false,
     "statusCode": 500,
     "message": "Error description",
     "data": null
   }
```

### Authentication Flow Details
```
1. Protected Route Access
   ↓
2. AuthMiddleware.authenticate
   - Extract token from Authorization header
   - Verify token with JWT secret
   ↓
3. Token Validation
   - If valid: set req.user.id, continue
   - If expired: attempt refresh
   - If invalid: return 403 error
   ↓
4. Token Refresh (if needed)
   - Extract refresh token from cookie
   - Validate refresh token
   - Generate new access token
   - Return new token to client
```

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "statusCode": 400|401|403|404|500,
  "message": "Error description",
  "data": null
}
```

### Common Error Scenarios

#### Authentication Errors
- **401 Unauthorized**: No token provided
- **403 Forbidden**: Invalid token
- **401 Token Expired**: Automatic refresh attempted

#### Validation Errors
- **400 Bad Request**: Invalid input data (Joi validation)
- **400 Bad Request**: Missing required parameters

#### Resource Errors
- **404 Not Found**: Resource doesn't exist
- **403 Forbidden**: No permission to access resource

#### Server Errors
- **500 Internal Server Error**: Database connection issues, unexpected errors

## Possible Improvements

### 1. Security Enhancements
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Input Sanitization**: Add SQL injection protection
- **HTTPS Enforcement**: Force HTTPS in production
- **Password Policies**: Implement stronger password requirements
- **Session Management**: Add session invalidation on logout

### 2. Performance Optimizations
- **Database Indexing**: Add proper indexes on frequently queried columns
- **Connection Pooling**: Optimize database connection management
- **Caching**: Implement Redis for caching frequently accessed data
- **Query Optimization**: Review and optimize database queries
- **Pagination**: Add pagination to large data sets

### 3. API Improvements
- **API Versioning**: Implement proper API versioning strategy
- **Request/Response Logging**: Add comprehensive logging
- **API Documentation**: Generate OpenAPI/Swagger documentation
- **Validation Middleware**: Centralize input validation
- **Response Compression**: Add gzip compression

### 4. Feature Enhancements
- **Real-time Notifications**: WebSocket implementation for live updates
- **File Management**: Better file upload/download system
- **Email Notifications**: Automated email notifications
- **Audit Logging**: Track all data changes
- **Data Export**: Export functionality for reports

### 5. Code Quality
- **Testing**: Add unit tests and integration tests
- **Error Codes**: Implement standardized error codes
- **Code Documentation**: Add JSDoc comments
- **Linting**: Add ESLint configuration
- **Type Safety**: Consider TypeScript migration

### 6. Infrastructure
- **Environment Configuration**: Better environment management
- **Health Checks**: Add health check endpoints
- **Monitoring**: Implement application monitoring
- **Backup Strategy**: Automated database backups
- **Deployment**: CI/CD pipeline setup

### 7. Specific API Improvements

#### Authentication
- **2FA Support**: Two-factor authentication
- **Password Reset**: Forgot password functionality
- **Account Lockout**: Prevent brute force attacks

#### File Upload
- **File Validation**: Better file type and size validation
- **Cloud Storage**: Move to cloud storage (AWS S3, etc.)
- **Image Processing**: Automatic image optimization

#### Attendance System
- **Bulk Operations**: Bulk attendance marking
- **Attendance Analytics**: Generate attendance reports
- **Integration**: QR code or biometric integration

#### Notification System
- **Push Notifications**: Mobile push notifications
- **Email Templates**: HTML email templates
- **Notification Preferences**: User notification settings

### 8. Database Improvements
- **Data Migration**: Implement database migration system
- **Soft Deletes**: Implement soft delete functionality
- **Relationships**: Better foreign key relationships
- **Views**: Create database views for complex queries

This documentation provides a comprehensive overview of the KAKSHA backend API system. Each endpoint follows a consistent pattern and includes proper error handling and authentication mechanisms.