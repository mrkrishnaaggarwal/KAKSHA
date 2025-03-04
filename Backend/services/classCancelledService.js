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
}

export default ClassCancelledService;