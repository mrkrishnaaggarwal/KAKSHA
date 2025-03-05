import ClassCancelledModel from '../models/classCancelled.js';
import StudentModel from '../models/studentModel.js';
import apiResponse from '../utils/apiResponse.js';

class ClassCancelledService {
    constructor() {
        this.classCancelledModel = new ClassCancelledModel();
        this.studentModel = new StudentModel();
    }

    async getCancelledClasses(studentId) {
        try {
            // Get student's class ID
            const classIdResponse = await this.studentModel.getClassId(studentId);
            
            // Check if the response is an apiResponse object (has statusCode property)
            if (classIdResponse && typeof classIdResponse === 'object' && 'statusCode' in classIdResponse) {
                // It's an error response from getClassId
                return classIdResponse; // Return the error response directly
            }
            
            // If we got here, classIdResponse should be the actual class ID
            const classId = classIdResponse;
            console.log(classId);
            // Get cancelled classes for that class
            const response = await this.classCancelledModel.getCancelledClasses(classId);
            return response;
        } catch (error) {
            console.error('[ClassCancelledService] Error:', error);
            return new apiResponse(500, null, "Service error occurred");
        }
    }
    
    async cancelClass(classId, subject, date) {
        console.log('\n[ClassCancelledService] Cancelling class:', {
            classId,
            subject,
            date,
            timestamp: new Date().toISOString()
        });
        
        try {
            // Basic validation
            if (!classId || isNaN(parseInt(classId))) {
                return new apiResponse(400, null, "Valid class ID is required");
            }
            
            if (!subject || subject.trim() === '') {
                return new apiResponse(400, null, "Subject is required");
            }
            
            // Validate date format (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!date || !dateRegex.test(date)) {
                return new apiResponse(400, null, "Valid date is required in YYYY-MM-DD format");
            }
            
            // Check if date is in the past
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to start of day
            const cancelDate = new Date(date);
            
            if (cancelDate < today) {
                return new apiResponse(400, null, "Cannot cancel classes in the past");
            }
            
            // Call model to cancel the class
            const response = await this.classCancelledModel.cancelClass(
                parseInt(classId),
                subject,
                date
            );
            
            return response;
        } catch (error) {
            console.error('[ClassCancelledService] Error:', error);
            return new apiResponse(500, null, "Service error occurred");
        }
    }
}

export default ClassCancelledService;