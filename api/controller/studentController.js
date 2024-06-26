const CourseModel = require("../model/courseModel");
const multer = require('multer');
const ProfessorModel = require('../model/professorModel');
const studentModel = require("../model/studentModel");
const AttendanceModel = require("../model/attendenceModel");
const Discussion = require("../model/DiscussionModel");
const AssignmentModel = require("../model/assignmentModel");
const QuizModel = require("../model/QuizModel");

const getAllCourseStudentController = async(req, res) => {
    try {
        const courses = await CourseModel
            .find({})
            .sort({createdAt: -1})
            .populate('instructor', 'name');
        // const courses = await CourseModel.find({})

        return res
            .status(200)
            .send({success: true, courses, message: 'Retrieved all courses successfully.'});
    } catch (error) {
        console.error('Error retrieving courses:', error);
        return res
            .status(500)
            .send({success: false, message: `Error retrieving courses: ${error.message}`});
    }
};
//
// enrollCourseController

const enrollCourseController = async(req, res) => {
    try {
        const courseId = req.body.courseId;
        const studentId = req.body.studentId;
console.log(req.body);
        const course = await CourseModel.findById(courseId);

        if (!course) {
            return res
                .status(404)
                .send({success: false, message: 'Course not found.'});
        }

        if (course.students.includes(studentId)) {
            return res
                .status(200)
                .send({success: true, message: 'Already enrolled.'});
        }

        // Push the student ID to the students array
        course
            .students
            .push(studentId);

        // Save the updated course document
        await course.save();

        return res
            .status(200)
            .send({success: true, message: 'Enrolled successfully.'});
    } catch (error) {
        console.error('Error enrolling in course:', error);
        return res
            .status(500)
            .send({success: false, message: `Error in enrolling in course: ${error.message}`});
    }
};

const getMyCourseController = async(req, res) => {
    try {
        const studentId = req.body.studentId;

        // Find all courses
        const courses = await CourseModel.find({}).populate({ path: 'instructor', options: { strictPopulate: false } });

        // Filter courses where the student is enrolled
        const myCourses = courses.filter(course => course.students.includes(studentId));

        // Update the student's MyCourses field
        const student = await studentModel.findByIdAndUpdate(studentId, {
            MyCourses: myCourses
        }, {new: true});

        return res
            .status(200)
            .send({success: true, message: 'Your courses.', courses: myCourses});
    } catch (error) {
        console.error('Error getting student courses:', error);
        return res
            .status(500)
            .send({success: false, message: `Error in getting student courses: ${error.message}`});
    }
};
const getACourseController = async(req, res) => {
    try {
        const course = await CourseModel.findById(req.body.courseId).populate('instructor', 'name');
        
        return res
            .status(201)
            .send({success: true,course, message: `course data.`});

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({success: false, message: `course adata error ${error.message}`});
    }

};
const submitAssignmentController = async (req, res) => { 
    try {
        const {   id , sId} = req.body;
        const file = req.file;

        const assignment = await AssignmentModel.findById(id);
        if (!assignment) {
            return res.status(405).send({ success: false, message: `assignment not found .` });
        }

        

        for (let submission of assignment?.SubmittedBy) {
            if (submission?.user == sId) {
                return res.status(301).send({ success: false,isSubmitted:true, message: `Assignment already submitted.` });
            }
        }

        assignment?.SubmittedBy.push({
            user: sId,
            fileUrl: file?.filename,
        });

        await assignment.save();

        return res.status(201).send({ success: true, message: `Assignment submitted successfully.` });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: `Assignment submission error: ${error.message}` });
    }
};

const getAssignmentController = async (req, res) => {
    try {
        const { courseId, studentId } = req.body;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return res.status(404).send({ success: false, message: `Course not found with id ${courseId}.` });
        }

        const assignments = await AssignmentModel.find({ course: courseId }).sort({ createdAt: 1 });

        if (!assignments || assignments.length === 0) {
            return res.status(404).send({ success: false, message: `Assignments not found for course ${course.name}.` });
        }

        let assignmentPending = null;

        for (const assignment of assignments) {
            let isSubmitted = false;
            for (const sub of assignment.SubmittedBy) {
                if (sub.user == studentId) {
                    isSubmitted = true;
                    break;
                }
            }
            if (!isSubmitted) {
                assignmentPending = assignment;
                break; // Stop looping once unsubmitted assignment is found
            }
        }

        if (assignmentPending) {
            return res.status(200).send({
                Assignments: assignmentPending,
                success: true,
                message: `Assignment pending for student ${studentId} in course ${course.name}.`
            });
        } else {
            return res.status(200).send({
                Assignments: null,
                success: true,
                message: `No pending assignments found for student ${studentId} in course ${course.name}.`
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: `Error in retrieving assignments: ${error.message}`
        });
    }
};

// const getAssignmentController = async (req, res) => {
//     try {
//       const { courseId, studentId } = req.body;
  
//       const course = await CourseModel.findById(courseId);
//       if (!course) {
//         return res.status(404).send({ success: false, message: `Course not found with id ${courseId}.` });
//       }
  
//       const assignments = await AssignmentModel.find({ course: courseId }).sort({ createdAt: 1 }); // Ensure ascending order for createdAt
  
//       if (!assignments || assignments.length === 0) {
//         return res.status(404).send({ success: false, message: `Assignments not found for course ${course.name}.` });
//       }
  
//       // Find the first unsubmitted assignment efficiently
//       const unsubmittedAssignment = assignments.find(
//         (assignment) => !assignment.SubmittedBy.some((sub) => sub.user === studentId)
//       );
  
//       if (unsubmittedAssignment) {
//         return res.status(200).send({
//           Assignments: unsubmittedAssignment, // Return only the first unsubmitted assignment
//           success: true,
//           message: `Assignment pending for student ${studentId} in course ${course.name}.`,
//         });
//       } else {
//         return res.status(200).send({
//           Assignments: null,
//           success: true,
//           message: `No pending assignments found for student ${studentId} in course ${course.name}.`,
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       return res.status(500).send({
//         success: false,
//         message: `Error in retrieving assignments: ${error.message}`,
//       });
//     }
//   };
  
// const getAssignmentController = async (req, res) => {
//     try {
//         const { courseId, studentId } = req.body;
//         console.log(req.body);

//         const course = await CourseModel.findById(courseId);
//         if (!course) {
//             return res.status(404).send({ success: false, message: `Course not found with id ${courseId}.` });
//         }

//         const assignments = await AssignmentModel.find({ course: courseId }).sort({createdAt:1});
        
//         if (!assignments || assignments.length === 0) {
//             return res.status(404).send({ success: false, message: `Assignments not found for course ${course.name}.` });
//         }

//         let assignmentPending = null;


//         for (const assignment of assignments) { 
//             for (const sub of assignment?.SubmittedBy ) {
//                 if (sub?.user == studentId || sub.length !==0) {
//                     continue;
//                 }else{
//                     assignmentPending = assignment;
//                     break;
//                 }
//             }
//         }

//         if (assignmentPending) {
//             return res.status(200).send({
//                 Assignments: assignmentPending,
//                 success: true,
//                 message: `Assignment pending for student ${studentId} in course ${course.name}.`
//             });
//         } else {
//             return res.status(200).send({
//                 Assignments: null,
//                 success: true,
//                 message: `No pending assignments found for student ${studentId} in course ${course.name}.`
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({
//             success: false,
//             message: `Error in retrieving assignments: ${error.message}`
//         });
//     }
// };


const attendenceController = async (req, res) => {
    const { date, userId, courseId } = req.body;
  
    try {

        const parsedDate = new Date(date);
        console.log(parsedDate);

    if (isNaN(parsedDate.valueOf())) {
      // Handle invalid date format
      return res.status(400).send({
        success: false,
        message: "Invalid date format."
      });
    }
      // Find the course by courseId
      let course = await CourseModel.findById(courseId);
  
      if (!course) {
        return res.status(404).send({
          success: false,
          message: "Course not found."
        });
      }
  
      // Check if attendance for the given date already exists
      let attendanceRecord = course.attendanceDetails.find(record => record.date.toDateString() === new Date(date).toDateString());
  
      if (attendanceRecord) {
        // Check if userId already exists in studentsPresent array
        if (attendanceRecord.studentsPresent.includes(userId)) {
          return res.status(200).send({
            success: true,
            message: "Attendance already recorded for this date."
          });
        } else {
          // Add userId to studentsPresent array of existing attendance record
          attendanceRecord.studentsPresent.push(userId);
        }
      } else {
        // Create a new attendance record
        attendanceRecord = {
          date: new Date(date),
          studentsPresent: [userId]
        };
        course.attendanceDetails.push(attendanceRecord);
      }
  
      // Save the updated course with attendance record
      await course.save();
  
      return res.status(201).send({
        success: true,
        message: "Attendance recorded successfully."
      });
    } catch (error) {
      console.error('Error in attendance recording:', error);
      return res.status(500).send({
        success: false,
        message: `Error in attendance recording: ${error.message}`
      });
    }
  };
  
  

const createDiscussion = async (req, res) => {
    try {
        // Extract title, text, and author from the request body
        const { title, text, author } = req.body;

        // Check if a discussion with the same title already exists
        const existingDiscussion = await Discussion.findOne({ title });

        if (existingDiscussion) {
            // If a discussion with the same title exists, return with an error response
            return res.status(400).json({
                success: false,
                message: 'Discussion with this title already exists.'
            });
        }

        // If no discussion with the same title exists, create a new discussion
        const discussion = new Discussion({
            title,
            text,
            author
        });

        // Save the new discussion to the database
        await discussion.save();

        // Return a success response
        return res.status(201).json({
            success: true,
            message: 'Discussion created successfully',
            discussion
        });
    } catch (error) {
        // Handle errors
        console.error('Error creating discussion:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create discussion. Please try again later.'
        });
    }
};

const getAllDiscussion = async (req, res) => {
    try {
        // Fetch all discussions from the database
        const discussions = await Discussion.find();

        // Return a success response with the discussions
       
        return res.status(200).send({   success: true,
            message: 'All discussions retrieved successfully',
            discussions  });
    } catch (error) {
        // Handle errors
        console.error('Error fetching discussions:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch discussions. Please try again later.'
        });
    }
};
// const oneDiscussion = async (req, res) => { 
//         try {
//             const discussion = await Discussion.findById(req.body.id).populate('author', 'name');
//             if (!discussion)
//                 return res.status(404).json({ success: false, message: 'Discussion not found' });       
                
                
//             res.status(200).send({ success: true, discussion });
//         } catch (error) {
//             console.error('Error fetching discussion:', error);
//             res.status(500).send({ success: false, message: 'Internal server error' });
//         }
    
    
// };

const oneDiscussion = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.body.id);

        if (!discussion)
            return res.status(404).json({ success: false, message: 'Discussion not found' });

        res.status(200).send({ success: true, discussion });
    } catch (error) {
        console.error('Error fetching discussion:', error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
};

// 
const getReply = async (req, res) => {
    try {
        const { id, text, author } = req.body;

        const discussion = await Discussion.findById(id);
        if (!discussion) {
            return res.status(404).json({ success: false, message: 'Discussion not found' });
        }

        const reply = {
            text,
            author
        };

        discussion.replies.push(reply);

        await discussion.save();

        return res.status(201).json({
            success: true,
            message: 'Reply added successfully',
            discussion : discussion
        });
    } catch (error) {
        console.error('Error adding reply:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add reply. Please try again later.'
        });
    }
};

const getAllCourseQuizes = async(req,res) =>{

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
        
}
// getQuiz
const getQuiz = async (req, res) => {
    const id = req.params.id;
  
    try {
      const quiz = await QuizModel.findById(id).populate({
        path: 'studentsAttended.studentId',
        select: 'name'  
    });
  
      if (!quiz) {
        return res.status(404).json({ success: false, message: 'No quiz found with that ID.' });
      }
  
      // Send the quiz as a JSON response
      res.status(200).json({ success: true, quiz });
    } catch (error) {
      console.error('Error fetching quiz:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  };

  const addScoreController = async (req, res) => {
    console.log(req.body); // score, studentId, outof
    const id = req.params.id;
    
    try {
        const quiz = await QuizModel.findById(id);
    
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'No quiz found with that ID.' });
        }
        
        // Destructure data from request body
        const { studentId, score, outof } = req.body;
        
        // Add the student's score to the quiz
        quiz.studentsAttended.push({
            studentId,
            score,
            outof
        });
        
        // Save the updated quiz document
        await quiz.save();
        
        // Send the updated quiz as a JSON response
        res.status(200).json({ success: true, quiz });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

module.exports = {
    getQuiz,
    enrollCourseController,
    getAllDiscussion,
    getMyCourseController,
    getAllCourseStudentController,
    getACourseController,
    submitAssignmentController,
    getAssignmentController,
    attendenceController,
    createDiscussion,
    oneDiscussion,
    getAllCourseQuizes,
    getReply,
    addScoreController
}
