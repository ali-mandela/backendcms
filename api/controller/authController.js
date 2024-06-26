const professorModel = require("../model/professorModel");
const studentModel = require("../model/studentModel");
const adminModel = require("../model/adminModel");
const { comparePassword, tokenGenerate, hashedPassword } = require("../utils/auth");

// register callback
const registerFacultyController = async (req, res) => {
    try {
        const existingUser = await professorModel.findOne({
            email: req.body.email
        });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: `user already exist.`
            });
        }
        const encryptedPassword = await hashedPassword(req.body.password);
        const newUser = new professorModel({
            name: req.body.name,
            email: req.body.email,
            password: encryptedPassword,
        });
        await newUser.save();
        return res.status(201).send({
            success: true,
            message: `user registered succesfully.`
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `register controller ${error.message}`
        });
    }
};

// registeradminController
const registeradminController = async (req, res) => {
   
    try {
        const existingUser = await adminModel.findOne({
            email: req.body.email
        });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: `admin already exist.`
            });
        }
        const encryptedPassword = await hashedPassword(req.body.password);
        const newUser = new adminModel({
            name: req.body.name,
            email: req.body.email,
            password: encryptedPassword,
        });
        await newUser.save();
        return res.status(201).send({
            success: true,
            message: `admin registered succesfully.`
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `register controller ${error.message}`
        });
    }
};

// login callback
const loginFacultyController = async (req, res) => {
    try {
        const user = await professorModel.findOne({
            email: req.body.email
        });
        if (!user) {
            return res.status(200).send({
                success: false,
                message: `user not found.`
            });
        }
        const isMatch = comparePassword(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({
                success: false,
                message: `inavlid credentails.`
            });
        }
        const token = await tokenGenerate(user?._id, user?.role);
        return res.status(200).send({
            success: true,
            token,
            user:user, 
            role:"professor",
            message: `login succesfully.`
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `login controller ${error.message}`
        });
    }

};

// loginadminController 
const loginadminController = async (req, res) => {
    try {
        const user = await adminModel.findOne({
            email: req.body.email
        });
        if (!user) {
            return res.status(200).send({
                success: false,
                message: `user not found.`
            });
        }
        const isMatch = comparePassword(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({
                success: false,
                message: `inavlid credentails.`
            });
        }
        const token =  tokenGenerate(user?._id, user?.role);
        return res.status(200).send({
            success: true,
            token,
            user:user,
            role:"admin",
            message: `login succesfully.`
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `login controller ${error.message}`
        });
    }

};

const registerStudentController = async (req, res) => {
    try {
        const existingUser = await studentModel.findOne({
            email: req.body.email
        });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: `user already exist.`
            });
        }
        const encryptedPassword = await hashedPassword(req.body.password);
        const newUser = new studentModel({
            name: req.body.name,
            email: req.body.email,
            password: encryptedPassword,
        });
        await newUser.save();
        return res.status(201).send({
            success: true,
            message: `student registered succesfully.`
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `register controller ${error.message}`
        });
    }
};

// login callback
const loginStudentController = async (req, res) => {
    try {
        const user = await studentModel.findOne({
            email: req.body.email
        });
        if (!user) {
            return res.status(200).send({
                success: false,
                message: `user not found.`
            });
        }
        const isMatch = comparePassword(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({
                success: false,
                message: `inavlid credentails.`
            });
        }
        const token = await tokenGenerate(user?._id, user?.role);
        return res.status(200).send({
            user:user,
            success: true,
            token,
            role:"student",
            message: `login succesfully.`
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `login controller ${error.message}`
        });
    }

};
const getUserController = async (req, res) => {

    try {
        let user;
        if(req.body.role =='admin'){
            user = await adminModel.findOne({
                _id: req.body.userId
            })
        } 
        if(req.body.role =='student'){
            user = await studentModel.findOne({
                _id: req.body.userId
            })
        } 
        if(req.body.role =='faculty'){
            user = await professorModel.findOne({
                _id: req.body.userId
            })
        } 
        if (!user) {
            return res
                .status(200)
                .send({
                    message: "User doesn't exists",
                    success: false
                });
        } else {
            return res
                .status(200)
                .send({
                    message: "user data fetched succesfully",
                   
                        user:user,
                    success: true
                });
        }

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send({
                message: "Auth error",
                success: false
            });
    }

}

module.exports = {loginFacultyController,getUserController,loginadminController,registeradminController, registerFacultyController, registerStudentController, loginStudentController}