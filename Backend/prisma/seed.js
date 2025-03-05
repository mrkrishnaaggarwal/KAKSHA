import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;


async function main() {
    console.log('Starting database seeding...');

    // Clean existing data
    await prisma.$transaction([
        prisma.announcement.deleteMany(),
        prisma.submission.deleteMany(),
        prisma.result.deleteMany(),
        prisma.homework.deleteMany(),
        prisma.classCancelled.deleteMany(),
        prisma.attendance.deleteMany(),
        prisma.timeTable.deleteMany(),
        prisma.professorClass.deleteMany(),
        prisma.student.deleteMany(),
        prisma.professor.deleteMany(),
        prisma.class.deleteMany(),
    ]);


    // Create Classes
    const classes = await Promise.all([
        prisma.class.create({
            data: { name: 'CSE-A', class_teacher: 'Dr. Smith' }
        }),
        prisma.class.create({
            data: { name: 'CSE-B', class_teacher: 'Dr. Johnson' }
        }),
        prisma.class.create({
            data: { name: 'IT-A', class_teacher: 'Dr. Williams' }
        }),
        prisma.class.create({
            data: { name: 'ECE-A', class_teacher: 'Dr. Brown' }
        })
    ]);
    console.log('Created classes:', classes.length);

    // Create Professors
    const professors = await Promise.all(
        Array.from({ length: 10 }, async (_, i) => {
            const rollNo = `PROF${String(i + 1).padStart(3, '0')}`;
            const password = `Professor@${rollNo}`;
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            return prisma.professor.create({
                data: {
                    firstName: `Professor${i + 1}`,
                    lastName: `Surname${i + 1}`,
                    dob: new Date(1970 + i, 0, 1),
                    rollNo,
                    email: `professor${i + 1}@university.edu`,
                    password: hashedPassword,
                    address: `Address ${i + 1}`,
                    dateOfJoin: new Date(2015 + i, 0, 1),
                    dept: ['CSE', 'IT', 'ECE'][i % 3],
                    photo: null
                }
            });
        })
    );
    console.log('Created professors:', professors.length);

    // Create Students
    const students = await Promise.all(
        Array.from({ length: 40 }, async (_, i) => {
            const rollNo = `STU${String(i + 1).padStart(3, '0')}`;
            const password = `Student@${rollNo}`;
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            return prisma.student.create({
                data: {
                    rollNo,
                    firstName: `Student${i + 1}`,
                    lastName: `Surname${i + 1}`,
                    email: `student${i + 1}@university.edu`,
                    password: hashedPassword,
                    classId: classes[i % classes.length].id,
                    semester: ((i % 8) + 1),
                    batch: '2023',
                    dob: new Date(2000 + (i % 5), 0, 1),
                    address: `Student Address ${i + 1}`,
                    photo: null,
                }
            });
        })
    );
    console.log('Created students:', students.length);

    // Create Professor-Class Assignments
    const professorClasses = await Promise.all(
        professors.flatMap(professor =>
            classes.slice(0, 2).map(class_ =>
                prisma.professorClass.create({
                    data: {
                        professorId: professor.id,
                        classId: class_.id,
                        subject: ['Mathematics', 'Physics', 'Programming', 'Networks'][Math.floor(Math.random() * 4)]
                    }
                })
            )
        )
    );
    console.log('Created professor-class assignments:', professorClasses.length);

    // Create Timetable Entries
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timetables = await Promise.all(
        classes.flatMap(class_ =>
            days.flatMap(day =>
                Array.from({ length: 4 }, (_, i) => {
                    const startHour = 9 + i * 2;
                    return prisma.timeTable.create({
                        data: {
                            classId: class_.id,
                            dayOfTheWeek: day,
                            startTime: new Date(2024, 0, 1, startHour),
                            endTime: new Date(2024, 0, 1, startHour + 1),
                            subject: ['Mathematics', 'Physics', 'Programming', 'Networks'][i % 4],
                            room: `Room-${100 + i}`,
                            professorId: professors[i % professors.length].id
                        }
                    });
                })
            )
        )
    );
    console.log('Created timetable entries:', timetables.length);

    // Create Homework Assignments
    const homework = await Promise.all(
        professors.slice(0, 5).map((professor, i) =>
            prisma.homework.create({
                data: {
                    title: `Assignment ${i + 1}`,
                    content: `Complete the assignment ${i + 1}`,
                    publishDate: new Date(2024, 0, 1),
                    submissionDate: new Date(2024, 0, 15),
                    professorId: professor.id,
                    classId: classes[i % classes.length].id,
                    totalMarks: 100
                }
            })
        )
    );
    console.log('Created homework assignments:', homework.length);

    const results = await Promise.all([
        ...Array(10)
    ].map((_, i) => 
        prisma.result.create({
            data: {
                exam: 'Mid Semester',
                date: new Date(2024, 0, 1),
                studentId: students[i].id,
                subject: 'Mathematics',
                marks: Math.floor(Math.random() * 41) + 60,
                totalMarks: 100,
                semester: students[i].semester
            }
        })
    ));
    console.log('Created results:', results.length);

    // Reduce Attendance Data
    const attendance = await Promise.all([
        ...Array(10)
    ].map((_, i) => 
        prisma.attendance.create({
            data: {
                studentId: students[i].id,
                timeTableId: timetables[0].id,
                date: new Date(),
                status: Math.random() > 0.2 ? 'Present' : 'Absent'
            }
        })
    ));
    console.log('Created attendance records:', attendance.length);

    // Create Announcements
    const announcements = await Promise.all(
        professors.slice(0, 3).map((professor, i) =>
            prisma.announcement.create({
                data: {
                    classId: classes[i % classes.length].id,
                    visibility: 1,
                    title: `Announcement ${i + 1}`,
                    content: `Important announcement ${i + 1}`,
                    professorId: professor.id,
                    date: new Date()
                }
            })
        )
    );
    console.log('Created announcements:', announcements.length);

    console.log('Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });