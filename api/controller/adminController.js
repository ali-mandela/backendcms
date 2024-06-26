const professorModel = require("../model/professorModel");
const studentModel = require("../model/studentModel");
const adminModel = require("../model/adminModel");
const { comparePassword, tokenGenerate, hashedPassword } = require("../utils/auth");



const getAllUserController = async (req, res) => {

    try {
        const users = await studentModel.find();
        if (!users) {
            return res
                .status(200)
                .send({
                    message: "No user available",
                    success: false
                });
        } else {
            return res
                .status(200)
                .send({
                    message: "All user data fetched succesfully",
                   
                        users:users,
                    success: true
                });
        }

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send({
                message: "get student error",
                success: false
            });
    }

}
const getAllFacultyController = async (req, res) => {

    try {
        const users = await professorModel.find();
        if (!users) {
            return res
                .status(200)
                .send({
                    message: "No user available",
                    success: false
                });
        } else {
            return res
                .status(200)
                .send({
                    message: "All user data fetched succesfully",
                   
                        users:users,
                    success: true
                });
        }

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send({
                message: "get faculty error",
                success: false
            });
    }

}
module.exports = {getAllUserController,getAllFacultyController}