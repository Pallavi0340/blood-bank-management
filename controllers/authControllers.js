const usermodel = require("../models/usermodel");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const registerController = async (req, res) => {
    try {
        const existingUser = await usermodel.findOne({ email: req.body.email })
        //validation
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'User Already exists'
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        req.body.password = hashedPassword
        //rest data
        const user = new usermodel(req.body)
        const savedUser = await user.save();
        savedUser.password = undefined;


        return res.status(201).send({
            success: true,
            message: 'User Registered Successfully',
            user,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error In Register API',
            error
        })
    }
};


//login call back
const loginController = async (req, res) => {
    try {
        console.log("BODY:", req.body)
        console.log("EMAIL:", req.body.email)
        const user = await usermodel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User Not Found'
            })
        }

        //check role
        if (user.role !== req.body.role) {
            return res.status(500).send({
                success: false,
                message: 'Role does not match'
            })
        }
        //compare password
        const comparePassword = await bcrypt.compare(req.body.password, user.password)
        if (!comparePassword) {
            return res.status(500).send({
                success: false,
                message: 'Invalid Credentials'
            })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        return res.status(200).send({
            success: true,
            message: 'Login Successfully',
            token,
            user,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error In Login API',
            error,
        });
    }
};


// GET CURRENT USER
const currentUserController = async (req, res) => {
    try {
        const user = await usermodel.findOne({ _id: req.userId })
        return res.status(200).send({
            success: true,
            message: 'User fetched successfully',
            user,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Unable to find current user',
            error,
        });
    }
};
module.exports = { registerController, loginController, currentUserController };