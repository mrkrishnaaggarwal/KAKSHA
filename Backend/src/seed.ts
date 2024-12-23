import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  try {
    // Clear existing data
    await prisma.$transaction([
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
    const classes = await Promise.all([
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
    const hashedProfPassword = await hash('professor123', 10)
    const professors = await Promise.all([
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
    await Promise.all([
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
    const hashedStudentPassword = await hash('student123', 10)
    const students = await Promise.all([
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
    const timeTables = await Promise.all([
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
    await Promise.all([
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
    const homework = await Promise.all([
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
    await Promise.all([
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
    await Promise.all([
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
    await Promise.all([
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
    ])

    console.log('Seed data inserted successfully')
  } catch (error) {
    console.error('Error seeding data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })