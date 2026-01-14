const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const googleSheetsService = require('../services/googleSheetsService');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
const getStudents = asyncHandler(async (req, res) => {
    const { status, school, class: studentClass, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};

    if (status && status !== 'All') {
        query.status = status;
    }

    if (school && school !== 'All') {
        query.school = school;
    }

    if (studentClass && studentClass !== 'All') {
        query.class = studentClass;
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const students = await Student.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

    const total = await Student.countDocuments(query);

    res.json({
        success: true,
        data: students,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
        },
    });
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private/Admin
const getStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    res.json({
        success: true,
        data: student,
    });
});

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
    const { name, email, phone, school, class: studentClass, city, state, age } = req.body;

    // Check if student already exists
    const studentExists = await Student.findOne({ email });

    if (studentExists) {
        res.status(400);
        throw new Error('Student with this email already exists');
    }

    const student = await Student.create({
        name,
        email,
        phone,
        school,
        class: studentClass,
        city,
        state,
        age,
        status: 'Pending',
    });

    // TODO: Send invitation email to student

    res.status(201).json({
        success: true,
        data: student,
        message: 'Student created successfully',
    });
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.json({
        success: true,
        data: updatedStudent,
        message: 'Student updated successfully',
    });
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    await student.deleteOne();

    res.json({
        success: true,
        message: 'Student deleted successfully',
    });
});

// @desc    Bulk delete students
// @route   POST /api/students/bulk/delete
// @access  Private/Admin
const bulkDeleteStudents = asyncHandler(async (req, res) => {
    const { studentIds } = req.body;

    if (!studentIds || !Array.isArray(studentIds)) {
        res.status(400);
        throw new Error('Please provide an array of student IDs');
    }

    const result = await Student.deleteMany({ _id: { $in: studentIds } });

    res.json({
        success: true,
        message: `${result.deletedCount} students deleted successfully`,
    });
});

// @desc    Bulk activate students
// @route   POST /api/students/bulk/activate
// @access  Private/Admin
const bulkActivateStudents = asyncHandler(async (req, res) => {
    const { studentIds } = req.body;

    if (!studentIds || !Array.isArray(studentIds)) {
        res.status(400);
        throw new Error('Please provide an array of student IDs');
    }

    const result = await Student.updateMany(
        { _id: { $in: studentIds } },
        { status: 'Active' }
    );

    res.json({
        success: true,
        message: `${result.modifiedCount} students activated successfully`,
    });
});

// @desc    Export students to CSV
// @route   GET /api/students/export
// @access  Private/Admin
const exportStudents = asyncHandler(async (req, res) => {
    const students = await Student.find({});

    // Convert to CSV format
    const csvHeader = 'ID,Name,Email,Phone,School,Class,City,State,Age,Status,Join Date\n';
    const csvRows = students.map(s =>
        `${s._id},${s.name},${s.email},${s.phone},${s.school},${s.class},${s.city},${s.state},${s.age},${s.status},${s.joinDate}`
    ).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
    res.send(csv);
});

// @desc    Get student quiz statistics from Google Sheets
// @route   GET /api/students/:id/stats
// @access  Private/Admin
const getStudentStats = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    try {
        // Get all quizzes with Google Sheet IDs
        const quizzes = await Quiz.find({
            googleSheetId: { $exists: true, $ne: null, $ne: '' }
        });

        if (quizzes.length === 0) {
            // No quizzes with Google Sheets configured
            return res.json({
                success: true,
                data: {
                    avgScore: 0,
                    quizzesDone: 0,
                    consistency: 0,
                    recentActivity: [],
                },
            });
        }

        let allResponses = [];

        // Fetch responses from each quiz sheet
        for (const quiz of quizzes) {
            try {
                const rawData = await googleSheetsService.getQuizResponses(
                    quiz.googleSheetId
                );
                const responses = googleSheetsService.parseQuizData(
                    rawData,
                    student.email
                );
                allResponses = [...allResponses, ...responses];
            } catch (error) {
                console.error(`Error fetching quiz "${quiz.title}":`, error.message);
                // Continue with other quizzes
            }
        }

        const stats = googleSheetsService.calculateStats(allResponses);
        const recentActivity = googleSheetsService.formatRecentActivity(allResponses);

        res.json({
            success: true,
            data: {
                ...stats,
                recentActivity,
            },
        });
    } catch (error) {
        console.error('Error fetching student stats:', error);
        res.status(500);
        throw new Error('Failed to fetch student statistics');
    }
});

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    bulkDeleteStudents,
    bulkActivateStudents,
    exportStudents,
    getStudentStats,
};
