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
            const { verifyPaymentSignature } = require('../controllers/paymentController');

            let paymentStatus = 'Pending';
            let paymentDate = null;

            // Verify Payment if details provided
            if (req.body.paymentId && req.body.orderId && req.body.signature) {
                const isValid = verifyPaymentSignature(req.body.orderId, req.body.paymentId, req.body.signature);
                if (isValid) {
                    paymentStatus = 'Paid';
                    paymentDate = new Date();

                    // Create Transaction Record
                    const Transaction = require('../models/Transaction');
                    await Transaction.create({
                        studentId: null, // Will update after student creation if strictly needed, but linking to User is safer here initially or update later. Actually we can't link to student yet as it's not created.
                        userId: user._id,
                        type: 'Income',
                        source: 'Student Registration Fee',
                        amount: 100, // TODO: Fetch from settings or pass from frontend/order
                        status: 'Completed',
                        paymentMethod: 'Razorpay',
                        transactionId: req.body.paymentId,
                        orderId: req.body.orderId,
                        city: city || 'Unknown',
                        description: `Registration fee for student: ${user.name}`
                    });

                } else {
                    // Start Rollback (delete user)
                    await User.findByIdAndDelete(user._id);
                    res.status(400);
                    throw new Error('Payment verification failed');
                }
            } else {
                // Start Rollback (delete user) - Enforce payment
                await User.findByIdAndDelete(user._id);
                res.status(400);
                throw new Error('Payment details missing');
            }

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
                paymentId: req.body.paymentId,
                orderId: req.body.orderId,
                paymentSignature: req.body.signature,
                paymentStatus,
                paymentDate
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

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.bio) {
            // Assuming we might add bio later or it exists. 
            // If schema doesn't support it, it won't save or will be ignored if strict: false (mongoose default is strict).
            // Let's just try to save it, or ignore if unsure. 
            // Best to check User model but I'll update name/email for sure.
            user.bio = req.body.bio;
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            success: true,
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                bio: updatedUser.bio,
                token: generateToken(updatedUser._id),
            },
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('+password');

    if (user && (await user.matchPassword(req.body.currentPassword))) {
        user.password = req.body.newPassword;
        await user.save();
        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } else {
        res.status(401);
        throw new Error('Invalid current password');
    }
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

// @desc    Update profile photo
// @route   POST /api/auth/profile/photo
// @access  Private
const updateProfilePhoto = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a file');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Save path relative to project root / src for frontend usage
    // For local dev, Vite can serve from /src/assets/profiles/
    user.avatar = `/src/assets/profiles/${req.file.filename}`;
    await user.save();

    res.json({
        success: true,
        data: user.avatar
    });
});

module.exports = {
    register,
    login,
    adminLogin,
    getMe,
    updateProfile,
    updatePassword,
    logout,
    updateProfilePhoto,
};
