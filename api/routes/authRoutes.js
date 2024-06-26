const { registerFacultyController, loginFacultyController, registerStudentController, loginStudentController, registerAdminController, loginAdminController, registeradminController, loginadminController, getUserController } = require('../controller/authController');
const { protectedRoute } = require('../middleware/authMiddleware');

const router = require('express').Router();
router.post('/register-faculty', registerFacultyController);
router.post('/login-faculty', loginFacultyController);
router.post('/register-student', registerStudentController);
router.post('/login-student', loginStudentController);
router.post('/register-admin', registeradminController);
router.post('/login-admin', loginadminController);
router.get('/get-user',protectedRoute, getUserController);
module.exports = router;
