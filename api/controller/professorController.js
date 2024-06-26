const AssignmentModel = require("../model/assignmentModel");
const AttendanceModel = require("../model/attendenceModel");
const CourseModel = require("../model/courseModel");
const MaterialModel = require("../model/materialModel");
const studentModel = require("../model/studentModel");
const multer = require('multer');
const QuizModel = require("../model/QuizModel");

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'api/uploads/'); // Define the destination directory for file uploads
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Define the filename for uploaded files
    }
});

const upload = multer({storage: storage});

const createCourseController = async(req, res) => {
    try {
        const existingUser = await CourseModel.findOne({title: req.body.title});
        if (existingUser) {
            return res
                .status(200)
                .send({success: false, message: `Course already exist.`});
        }
        const newUser = new CourseModel(req.body);
        await newUser.save();
        return res
            .status(201)
            .send({success: true, message: `course created succesfully.`});

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({success: false, message: `course error ${error.message}`});
    }

};
// getAllCourseController

const getAllCourseController = async(req, res) => {
    try {
        const courses = await CourseModel.find({instructor: req.body.instructor});
        return res
            .status(201)
            .send({courses, success: true, message: `course List of professor.`});

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({success: false, message: `course error ${error.message}`});
    }

};

// createAnnouncementController
const createAnnouncementController = async(req, res) => {
    const {title, description, courseId} = req.body;
    const file = req.file; // Assuming you're also uploading a file

    try {
        // Retrieve the course document based on the courseId
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res
                .status(404)
                .send({success: false, message: `Course not found with id ${courseId}.`});
        }

        // Construct the announcement object
        const announcement = {
            title,
            description,
            fileUrl: file
                ?.filename // ? file.path : null // Store the file path or null if no file is uploaded
        };

        // Add the announcement to the course's announcement array
        course
            .announcement
            .push(announcement);

        // Save the updated course document
        await course.save();

        return res
            .status(201)
            .send({success: true, message: `Announcement posted successfully.`});
    } catch (error) {
        console.error('Error posting announcement:', error);
        return res
            .status(500)
            .send({success: false, message: `Error in posting announcement: ${error.message}`});
    }
};

//  getAnnouncementController
const getAnnouncementController = async(req, res) => {
    console.log(req.body.index, req.body.courseId);

    try {
        const courses = await CourseModel.findById(req.body.courseId);
        const Announcement = courses
            ?.announcement;
        return res
            .status(201)
            .send({Announcement, success: true, message: `Announcement List of course.`});

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({success: false, message: `Announcement error ${error.message}`});
    }

};

//  deleteAnnouncement
const deleteAnnouncement = async(req, res) => {
    try {
        // Find the course by ID
        const course = await CourseModel.findById(req.body.courseId);

        // Ensure the course exists
        if (!course) {
            return res
                .status(404)
                .send({success: false, message: `Course not found.`});
        }

        // Get the announcement array from the course
        let announcements = course.announcement;

        // Remove the announcement at the specified index
        announcements.splice(req.body.index, 1);

        // Update the course document with the modified announcement array
        await CourseModel.findByIdAndUpdate(req.body.courseId, {announcement: announcements});

        return res
            .status(201)
            .send({success: true, message: `Announcement deleted successfully.`});

    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({success: false, message: `Announcement delete error: ${error.message}`});
    }

};

const createMaterialController = async(req, res) => {

    const {title, description, courseId} = req.body;
    const file = req.file;

    try {

        const newMaterial = new MaterialModel({title, description, fileUrl: file.filename, course: courseId})
        await newMaterial.save();

        return res
            .status(201)
            .send({success: true, message: `Material posted successfully.`});
    } catch (error) {
        console.error('Error posting Material:', error);
        return res
            .status(500)
            .send({success: false, message: `Error in posting Material: ${error.message}`});
    }
};
//  getAnnouncementController
const getMaterialController = async(req, res) => {
    console.log(req.body.index, req.body.courseId);

    try {
        const materials = await MaterialModel.find({course: req.body.courseId});
        return res
            .status(201)
            .send({materials, success: true, message: `materials List of course.`});

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({success: false, message: `materials error ${error.message}`});
    }

};

//  deleteMaterial
const deleteMaterial = async(req, res) => {
    try {
        // Find the course by ID
        const material = await MaterialModel.findByIdAndDelete(req.body.id);

        // Ensure the material exists
        if (!material) {
            return res
                .status(404)
                .send({success: false, message: `Course not found.`});
        }

        return res
            .status(201)
            .send({success: true, message: `materials deleted successfully.`});

    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({success: false, message: `materials delete error: ${error.message}`});
    }

};

const createAssignmentController = async(req, res) => {
    const {title, description, courseId} = req.body;
    const file = req.file; // Assuming you're also uploading a file

    try {

        const newAssignment = new AssignmentModel({title, description, fileUrl: file.filename, course: courseId})
        await newAssignment.save();

        return res
            .status(201)
            .send({success: true, message: `Assignments posted successfully.`});
    } catch (error) {
        console.error('Error posting Assignments:', error);
        return res
            .status(500)
            .send({success: false, message: `Error in posting Assignments: ${error.message}`});
    }
};
//  getAnnouncementController
const getAssignmentController = async(req, res) => {

    try {
        const Assignments = await AssignmentModel.find({course: req.body.courseId});
        return res
            .status(201)
            .send({Assignments, success: true, message: `Assignments List of course.`});

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({success: false, message: `Assignments error ${error.message}`});
    }

};

//  deleteMaterial
const deleteAssignment = async(req, res) => {

    try {
        // Find the course by ID
        console.log('delelel');
        console.log(req.body);
        const assignment = await AssignmentModel.findByIdAndDelete(req.body.id);

        // Ensure the course exists
        if (!assignment) {
            return res
                .status(404)
                .send({success: false, message: `Course not found.`});
        }

        return res
            .status(201)
            .send({success: true, message: `Assignment deleted successfully.`});

    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({success: false, message: `materials delete error: ${error.message}`});
    }

};

const courseStudents = async(req, res) => {
    try {
        const course = await CourseModel
            .findById(req.body.id)
            .populate({
                path: 'students',
                populate: {
                    path: 'students',
                    select: 'name'
                }
            })
            .populate('students', 'name');

        if (!course) {
            return res
                .status(404)
                .send({success: false, message: `Course not found.`});
        }

        const students = course.students;

        return res
            .status(200)
            .send({success: true, message: `Students list.`, students});

    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({success: false, message: `Students list error: ${error.message}`});
    }
};
const StudentAttendence = async (req, res) => {
    const { sId, courseId } = req.body;
    console.log(sId, courseId);
  
    try {
      // Find the course by courseId
      const course = await CourseModel.findById(courseId);
  
      if (!course) {
        return res.status(404).send({
          success: false,
          message: "Course not found."
        });
      }
  
      // Find attendance details for the student in the course
      const studentAttendance = course.attendanceDetails.filter(attendance => {
        return attendance.studentsPresent.includes(sId);
      });
  
      // Populate student names from the 'Student' model assuming 'student' is a ref in AttendanceModel
      const populatedAttendance = await AttendanceModel.populate(studentAttendance, {
        path: 'studentsPresent',
        select: 'name'
      });
  
      return res.status(200).send({
        success: true,
        message: "Attendance details found.",
        dates: populatedAttendance
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: `Error fetching attendance details: ${error.message}`
      });
    }
  };
  
// getStudentCourseMark const getStudentCourseMark = async (req, res) => {
// console.log("Request Body:", req.body);     try {         const student =
// await studentModel.findById(req.body.sId);         if (!student) {
//  return res.status(404).send({ success: false, message: `Student not found.`
// });         }         const myCourse = student.MyCourses ; //.find(course =>
// course._id === req.body.id);         console.log(myCourse);         for(let
// i=0; i< myCourse.length; i++){             console.log(myCourse[i]?._id);
//         if(myCourse[i]._id.toString() == req.body.id){                 const
// marks = myCourse?.marks;         return res.status(200).send({ success: true,
// message: `Marks for the course.`, marks });             }         }     }
// catch (error) {         console.error(error);         res.status(500).send({
// success: false, message: `Error: ${error.message}` });     } };
const getStudentCourseMark = async(req, res) => {
    console.log("Request Body:", req.body);
    try {
        const student = await studentModel.findById(req.body.sId);

        if (!student) {
            return res
                .status(404)
                .send({success: false, message: `Student not found.`});
        }

        const mycourse = student.MyCourses;

        if (!mycourse) {
            return res
                .status(404)
                .send({success: false, message: `Course not found for the student.`});
        }

        for (let i = 0; i < mycourse.length;) {
            if (mycourse[i]
                ?._id.toString() !== req.body.id) {

                i++;
            } else {
                let marks = mycourse[i]
                    ?.marks;
                return res
                    .status(200)
                    .send({success: true, message: `Marks for the course.`, marks});
            }
        }
        return res
            .status(200)
            .send({success: true, message: `Error in getting the mark for the course.`});

    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({success: false, message: `Error: ${error.message}`});
    }
};

//  updateStuMark const updateStuMark = async (req, res) => {
// console.log("Request Body:", req.body);     const { studentId, courseId,
// marks } = req.body;     try {         const student = await
// studentModel.findById(studentId);         if (!student) {             return
// res.status(404).send({ success: false, message: `Student not found.` });
//    }         const courseIndex = student?.MyCourses.findIndex(course =>
// course?._id === courseId);         if (courseIndex === -1) {
// return res.status(404).send({ success: false, message: `Course not found for
// the student.` });         }         student.MyCourses[courseIndex].marks =
// marks;         await student.save();         return res.status(200).send({
// success: true, message: `Marks updated successfully.`, marks });     } catch
// (error) {         console.error(error);         res.status(500).send({
// success: false, message: `An error occurred while updating marks. Please try
// again later.` });     } };

const updateStuMark = async(req, res) => {
    console.log("Request Body:", req.body);

    const {studentId, assignmentId, mark} = req.body;
    try {
        const assignment = await AssignmentModel.findById(assignmentId);

        if (!assignment) {
            return res
                .status(404)
                .send({success: false, message: `Assignment not found.`});
        }

        const submission = assignment
            .SubmittedBy
            .find(sub => sub.user.toString() === studentId);

        if (!submission) {
            return res
                .status(404)
                .send({success: false, message: `Submission not found for student.`});
        }

        console.log(submission);

        submission.marks = mark;
        await assignment.save();

        return res
            .status(200)
            .send({success: true, message: `Marks updated successfully.`});
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({success: false, message: `An error occurred while updating marks. Please try again later.`});
    }
};

const getSingleAssignmentController = async(req, res) => {
    try {
        const assignment = await AssignmentModel
            .findById(req.body.id)
            .populate({
                path: 'Course',
                options: {
                    strictPopulate: false
                }
            })
            .populate({
                path: 'SubmittedBy.user',
                options: {
                    strictPopulate: false
                }
            });

        if (!assignment) {
            return res
                .status(404)
                .send({success: false, message: `Assignment not found with ID ${req.body.id}.`});
        }

        return res
            .status(200)
            .send({success: true, message: 'Assignment retrieved successfully.', assignment});
    } catch (error) {
        console.error('Error retrieving assignment:', error);
        return res
            .status(500)
            .send({success: false, message: 'Internal server error.'});
    }
};

// getSingleMaterialController

const getSingleMaterialController = async(req, res) => {
    try {
        const material = await MaterialModel
            .findById(req.body.id)
            .populate({
                path: 'Course',
                options: {
                    strictPopulate: false
                }
            });;

        if (!material) {
            return res
                .status(404)
                .send({success: false, message: `material not found with ID ${req.body.id}.`});
        }

        return res
            .status(200)
            .send({success: true, message: 'material retrieved successfully.', material});
    } catch (error) {
        console.error('Error retrieving material:', error);
        return res
            .status(500)
            .send({success: false, message: 'Internal server error.'});
    }
};

const createQuiz = async(req, res) => {
    const {title, description, questions,courseId} = req.body; 

    try {
        const newQuiz = new QuizModel({title, description, questions, courseId});
        const savedQuiz = await newQuiz.save();

        res.status(201)
            .json(savedQuiz);
    } catch (error) {
        console.error('Error creating quiz:', error);
        res
            .status(500)
            .json({error: 'Failed to create quiz'});
    }
};

const getAllCourseQuizes = async (req, res) => {
    const id = req.params.id;  
  
    try { 
      const quizzes = await QuizModel.find({ courseId:id });
  
      if (!quizzes) {
        return res.status(404).send({ success: false, message: 'No quizzes found for this course.' });
      }
  
      // Send the quizzes as a JSON response
      res.status(200).json({ success: true, quizzes });
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      return res.status(500).send({ success: false, message: 'Internal server error.' });
    }
  };
module.exports = {
    createCourseController,
    updateStuMark,

    createMaterialController,
    getStudentCourseMark,
    deleteMaterial,
    getMaterialController,
    getAllCourseController,
    StudentAttendence,
    deleteAnnouncement,
    createAnnouncementController,
    createQuiz,

    getAnnouncementController,
    upload,
    getAssignmentController,
    createAssignmentController,
    deleteAssignment,
    courseStudents,
    getSingleAssignmentController,
    getSingleMaterialController,
    getAllCourseQuizes

}