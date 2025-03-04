import apiResponse from '../utils/apiResponse.js';
import TimeTableModel from '../models/timeTableModel.js';

class ProfessorTimeTableService {
    constructor() {
        this.timeTableModel = new TimeTableModel();
        console.log('[ProfessorTimeTableService] Initialized');
    }

    async getProfessorTimeTable(professorId) {
        console.log('\n[ProfessorTimeTableService] Getting timetable for professor:', {
            professorId,
            timestamp: new Date().toISOString()
        });

        try {
            // Call model to get raw timetable data
            console.log('[ProfessorTimeTableService] Calling model to get professor timetable');
            const response = await this.timeTableModel.getProfessorTimeTable(professorId);

            // If successful, group the timetable by days for better structure
            if (response.success && Array.isArray(response.data)) {
                console.log('[ProfessorTimeTableService] Organizing timetable by days');
                
                const groupedByDay = {};
                const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                
                // Initialize empty arrays for each day to maintain order
                dayOrder.forEach(day => {
                    groupedByDay[day] = [];
                });
                
                // Group entries by day
                response.data.forEach(entry => {
                    const day = entry.day_of_the_week.trim();
                    if (!groupedByDay[day]) {
                        groupedByDay[day] = [];
                    }
                    
                    // Format times for better readability
                    const formattedEntry = {
                        id: entry.id,
                        startTime: entry.start_time,
                        endTime: entry.end_time,
                        subject: entry.subject,
                        room: entry.room,
                        className: entry.class_name,
                        classId: entry.class_id
                    };
                    
                    groupedByDay[day].push(formattedEntry);
                });
                
                // Remove empty days
                Object.keys(groupedByDay).forEach(day => {
                    if (groupedByDay[day].length === 0) {
                        delete groupedByDay[day];
                    }
                });
                
                console.log('[ProfessorTimeTableService] Successfully organized timetable');
                return new apiResponse(200, groupedByDay, "Professor timetable fetched successfully");
            }
            
            console.log('[ProfessorTimeTableService] Model response received:', {
                success: response.success,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString()
            });
            
            return response;
        } catch (error) {
            console.error('[ProfessorTimeTableService] Error:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return new apiResponse(500, null, "Service error occurred");
        }
    }
}

export default ProfessorTimeTableService;