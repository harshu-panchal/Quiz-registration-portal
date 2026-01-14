const express = require('express');
const {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    bulkDeleteStudents,
    bulkActivateStudents,
    exportStudents,
    getStudentStats,
    getStudentFilterOptions,
} = require('../controllers/studentController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

router.route('/')
    .get(getStudents)
    .post(createStudent);

router.get('/filters', getStudentFilterOptions);

router.get('/export', exportStudents);

router.post('/bulk/delete', bulkDeleteStudents);
router.post('/bulk/activate', bulkActivateStudents);

// Stats route must come before /:id to avoid conflict
router.get('/:id/stats', getStudentStats);

router.route('/:id')
    .get(getStudent)
    .put(updateStudent)
    .delete(deleteStudent);

module.exports = router;
