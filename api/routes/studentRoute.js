const {
    getAllCourseStudentController,
    attendenceController,
    getACourseController,
    getAssignmentController,
    submitAssignmentController,
    getMyCourseController,
    enrollCourseController,
    createDiscussion,
    getAllDiscussion,
    getReply,
    oneDiscussion,
    getAllCourseQuizes,
    getQuiz,
    addScoreController
} = require('../controller/studentController');
const {upload} = require('../controller/professorController')
const router = require('express').Router();

// router.post('/create', createCourseController)
router.get('/all-courses', getAllCourseStudentController)
router.post('/enroll-course', enrollCourseController)
router.post('/get-my-course', getMyCourseController)
router.post('/get-a-course', getACourseController)
router.post('/get-an-Assignment', getAssignmentController)
router.post('/submit-assignment', upload.single('file'), submitAssignmentController)
router.post('/attendance', attendenceController)
// quizzes
router.get('/quizzes/:id', getAllCourseQuizes);
router.get('/quiz/:id', getQuiz);
router.post('/quiz/:id', addScoreController);


// Route for creating a discussion
router.post('/discussions', createDiscussion)
router.get('/discussions', getAllDiscussion)
router.post('/discussions/single', oneDiscussion)
router.post('/reply', getReply)
// Export the router
module.exports = router;
