const { getAllUserController, getAllFacultyController } = require('../controller/adminController');
const { protectedRoute } = require('../middleware/authMiddleware');

const router = require('express').Router();
router.get('/get-all-students', protectedRoute,getAllUserController );
router.get('/get-all-faculty', protectedRoute,getAllFacultyController );
module.exports = router;
