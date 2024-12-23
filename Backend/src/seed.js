"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt_1 = require("bcrypt");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var classes, hashedProfPassword, professors, hashedStudentPassword, students, timeTables, homework, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 14, 15, 17]);
                    // Clear existing data
                    return [4 /*yield*/, prisma.$transaction([
                            prisma.attendance.deleteMany(),
                            prisma.submission.deleteMany(),
                            prisma.homework.deleteMany(),
                            prisma.result.deleteMany(),
                            prisma.announcement.deleteMany(),
                            prisma.classCancelled.deleteMany(),
                            prisma.timeTable.deleteMany(),
                            prisma.professorClass.deleteMany(),
                            prisma.student.deleteMany(),
                            prisma.professor.deleteMany(),
                            prisma.class.deleteMany(),
                        ])
                        // Create Classes
                    ];
                case 1:
                    // Clear existing data
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            prisma.class.create({
                                data: {
                                    name: 'Computer Science A',
                                    class_teacher: 'John Smith'
                                }
                            }),
                            prisma.class.create({
                                data: {
                                    name: 'Computer Science B',
                                    class_teacher: 'Sarah Johnson'
                                }
                            })
                        ])
                        // Create Professors
                    ];
                case 2:
                    classes = _a.sent();
                    return [4 /*yield*/, (0, bcrypt_1.hash)('professor123', 10)];
                case 3:
                    hashedProfPassword = _a.sent();
                    return [4 /*yield*/, Promise.all([
                            prisma.professor.create({
                                data: {
                                    firstName: 'Michael',
                                    lastName: 'Wilson',
                                    dob: new Date('1975-05-15'),
                                    rollNo: 'PROF001',
                                    email: 'michael.wilson@university.edu',
                                    password: hashedProfPassword,
                                    address: '123 University Ave, Academic City',
                                    dateOfJoin: new Date('2010-08-01'),
                                    dept: 'Computer Science'
                                }
                            }),
                            prisma.professor.create({
                                data: {
                                    firstName: 'Emily',
                                    lastName: 'Brown',
                                    dob: new Date('1980-03-20'),
                                    rollNo: 'PROF002',
                                    email: 'emily.brown@university.edu',
                                    password: hashedProfPassword,
                                    address: '456 College Road, Academic City',
                                    dateOfJoin: new Date('2015-08-01'),
                                    dept: 'Computer Science'
                                }
                            })
                        ])
                        // Create Professor-Class relationships
                    ];
                case 4:
                    professors = _a.sent();
                    // Create Professor-Class relationships
                    return [4 /*yield*/, Promise.all([
                            prisma.professorClass.create({
                                data: {
                                    professorId: professors[0].id,
                                    classId: classes[0].id,
                                    subject: 'Data Structures'
                                }
                            }),
                            prisma.professorClass.create({
                                data: {
                                    professorId: professors[1].id,
                                    classId: classes[1].id,
                                    subject: 'Algorithms'
                                }
                            })
                        ])
                        // Create Students
                    ];
                case 5:
                    // Create Professor-Class relationships
                    _a.sent();
                    return [4 /*yield*/, (0, bcrypt_1.hash)('student123', 10)];
                case 6:
                    hashedStudentPassword = _a.sent();
                    return [4 /*yield*/, Promise.all([
                            prisma.student.create({
                                data: {
                                    rollNo: 'STU001',
                                    firstName: 'Alex',
                                    lastName: 'Johnson',
                                    email: 'alex.johnson@university.edu',
                                    password: hashedStudentPassword,
                                    classId: classes[0].id,
                                    semester: 3,
                                    batch: '2023',
                                    dob: new Date('2000-01-15'),
                                    address: '789 Student Housing, Academic City'
                                }
                            }),
                            prisma.student.create({
                                data: {
                                    rollNo: 'STU002',
                                    firstName: 'Emma',
                                    lastName: 'Davis',
                                    email: 'emma.davis@university.edu',
                                    password: hashedStudentPassword,
                                    classId: classes[1].id,
                                    semester: 3,
                                    batch: '2023',
                                    dob: new Date('2000-05-20'),
                                    address: '321 Student Housing, Academic City'
                                }
                            })
                        ])
                        // Create Timetable entries
                    ];
                case 7:
                    students = _a.sent();
                    return [4 /*yield*/, Promise.all([
                            prisma.timeTable.create({
                                data: {
                                    classId: classes[0].id,
                                    dayOfTheWeek: 'Monday',
                                    startTime: new Date('2024-01-01T09:00:00'),
                                    endTime: new Date('2024-01-01T10:30:00'),
                                    subject: 'Data Structures',
                                    room: 'Room 101',
                                    professorId: professors[0].id
                                }
                            }),
                            prisma.timeTable.create({
                                data: {
                                    classId: classes[1].id,
                                    dayOfTheWeek: 'Tuesday',
                                    startTime: new Date('2024-01-01T11:00:00'),
                                    endTime: new Date('2024-01-01T12:30:00'),
                                    subject: 'Algorithms',
                                    room: 'Room 102',
                                    professorId: professors[1].id
                                }
                            })
                        ])
                        // Create Attendance records
                    ];
                case 8:
                    timeTables = _a.sent();
                    // Create Attendance records
                    return [4 /*yield*/, Promise.all([
                            prisma.attendance.create({
                                data: {
                                    studentId: students[0].id,
                                    timeTableId: timeTables[0].id,
                                    date: new Date('2024-01-15'),
                                    status: 'Present'
                                }
                            }),
                            prisma.attendance.create({
                                data: {
                                    studentId: students[1].id,
                                    timeTableId: timeTables[1].id,
                                    date: new Date('2024-01-16'),
                                    status: 'Present'
                                }
                            })
                        ])
                        // Create Homework assignments
                    ];
                case 9:
                    // Create Attendance records
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            prisma.homework.create({
                                data: {
                                    title: 'Implementation of Binary Trees',
                                    content: 'Implement a binary tree with basic operations in Python',
                                    publishDate: new Date('2024-01-10'),
                                    submissionDate: new Date('2024-01-20'),
                                    professorId: professors[0].id,
                                    classId: classes[0].id,
                                    totalMarks: 100
                                }
                            }),
                            prisma.homework.create({
                                data: {
                                    title: 'Sorting Algorithms Analysis',
                                    content: 'Implement and analyze the performance of different sorting algorithms',
                                    publishDate: new Date('2024-01-12'),
                                    submissionDate: new Date('2024-01-22'),
                                    professorId: professors[1].id,
                                    classId: classes[1].id,
                                    totalMarks: 100
                                }
                            })
                        ])
                        // Create Submissions
                    ];
                case 10:
                    homework = _a.sent();
                    // Create Submissions
                    return [4 /*yield*/, Promise.all([
                            prisma.submission.create({
                                data: {
                                    hwId: homework[0].id,
                                    studentId: students[0].id,
                                    content: 'Binary Tree implementation submitted',
                                    status: 'ontime',
                                    marks: 90
                                }
                            }),
                            prisma.submission.create({
                                data: {
                                    hwId: homework[1].id,
                                    studentId: students[1].id,
                                    content: 'Sorting algorithms analysis submitted',
                                    status: 'ontime',
                                    marks: 85
                                }
                            })
                        ])
                        // Create Results
                    ];
                case 11:
                    // Create Submissions
                    _a.sent();
                    // Create Results
                    return [4 /*yield*/, Promise.all([
                            prisma.result.create({
                                data: {
                                    exam: 'Midterm',
                                    date: new Date('2024-02-15'),
                                    studentId: students[0].id,
                                    subject: 'Data Structures',
                                    marks: 88,
                                    totalMarks: 100,
                                    semester: 3
                                }
                            }),
                            prisma.result.create({
                                data: {
                                    exam: 'Midterm',
                                    date: new Date('2024-02-15'),
                                    studentId: students[1].id,
                                    subject: 'Algorithms',
                                    marks: 92,
                                    totalMarks: 100,
                                    semester: 3
                                }
                            })
                        ])
                        // Create Announcements
                    ];
                case 12:
                    // Create Results
                    _a.sent();
                    // Create Announcements
                    return [4 /*yield*/, Promise.all([
                            prisma.announcement.create({
                                data: {
                                    classId: classes[0].id,
                                    visibility: 1,
                                    title: 'Midterm Examination Schedule',
                                    content: 'The midterm examination for Data Structures will be held on February 15th, 2024',
                                    professorId: professors[0].id,
                                    date: new Date('2024-02-01')
                                }
                            }),
                            prisma.announcement.create({
                                data: {
                                    classId: classes[1].id,
                                    visibility: 1,
                                    title: 'Project Submission Guidelines',
                                    content: 'Please follow the updated project submission guidelines for the Algorithms course',
                                    professorId: professors[1].id,
                                    date: new Date('2024-02-02')
                                }
                            })
                        ])];
                case 13:
                    // Create Announcements
                    _a.sent();
                    console.log('Seed data inserted successfully');
                    return [3 /*break*/, 17];
                case 14:
                    error_1 = _a.sent();
                    console.error('Error seeding data:', error_1);
                    throw error_1;
                case 15: return [4 /*yield*/, prisma.$disconnect()];
                case 16:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (error) {
    console.error(error);
    process.exit(1);
});
