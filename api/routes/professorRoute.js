const {
    createCourseController,
    getAllCourseController,
    deleteAnnouncement,
    createAnnouncementController,
    getAnnouncementController,
    upload,
    createMaterialController,
    getMaterialController,
    deleteMaterial,
    getAssignmentController,
    createAssignmentController,
    deleteAssignment,
    courseStudents,
    StudentAttendence,
    getStudentCourseMark,
    updateStuMark,
    getSingleAssignmentController,
    getSingleMaterialController,
    createQuiz,
    getAllCourseQuizes
} = require('../controller/professorController');
const router = require('express').Router();

router.post('/create', createCourseController)
router.post('/courses', getAllCourseController)
router.post('/post-announcement', createAnnouncementController)
router.post('/get-announcement', getAnnouncementController)
router.post('/delete-announcement', deleteAnnouncement)
router.post('/post-material', upload.single('file'), createMaterialController)
router.post('/get-material', getMaterialController)
router.post('/delete-material', deleteMaterial)
router.post('/post-Assignment', upload.single('file'), createAssignmentController)
router.post('/get-Assignment', getAssignmentController)
router.post('/delete-Assignment', deleteAssignment)
// 
router.post('/course-students',courseStudents)
router.post('/students-attendence',StudentAttendence)
router.post('/students-course-mark',getStudentCourseMark)
//  
router.post('/students-update-mark',updateStuMark)

router.post('/get-single-assignment',getSingleAssignmentController)
router.post('/get-single-material',getSingleMaterialController)
// quizzes
router.post('/quiz',createQuiz)
router.get('/get-all-quizes/:id',getAllCourseQuizes)

// router.post('/post-new-assignments',upload,newAssignmentPostController)
module.exports = router;