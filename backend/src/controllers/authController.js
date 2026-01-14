const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    const { name, email, password, role, phone, age, gender, school, class: studentClass, city, state } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'student',
    });

    if (user) {
        // If registering as a student, also create a Student record
        if (user.role === 'student' && phone && school) {
            const Student = require('../models/Student');
            await Student.create({
                userId: user._id,
                name: user.name,
                email: user.email,
                phone,
                school,
                class: studentClass || 'Not specified',
                city: city || 'Not specified',
                state: state || 'Not specified',
                age: age || 0,
                gender: gender || 'Other',
                status: 'Active',
            });
        }

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id),
            },
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id),
            },
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for admin user
    const user = await User.findOne({ email, role: 'admin' }).select('+password');

    if (user && (await user.matchPassword(password))) {
        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id),
            },
        });
    } else {
        res.status(401);
        throw new Error('Invalid admin credentials');
    }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    let responseData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
    };

    if (user.role === 'student') {
        const Student = require('../models/Student');
        const student = await Student.findOne({ userId: user._id });

        if (student) {
            responseData = {
                ...responseData,
                studentId: student._id, // Providing the actual Student document ID
                phone: student.phone,
                school: student.school,
                studentClass: student.class, // Mapping 'class' to 'studentClass'
                city: student.city,
                state: student.state,
                age: student.age,
                status: student.status,
                regDate: student.joinDate, // Mapping joinDate to regDate
                quizStatus: student.quizStatus || 'PENDING', // Assuming maybe this field exists or needs defaults
            };
        }
    }

    res.json({
        success: true,
        data: responseData,
    });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully',
    });
});

module.exports = {
    register,
    login,
    adminLogin,
    getMe,
    logout,
};
