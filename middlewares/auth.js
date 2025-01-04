import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../models/User"
dotenv.config()

exports.auth =async(req, res, next)=>{
    try {
        const token = req.cookies.token || req.body.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.substring(7) : null);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found",
            });
        }
        try {
            const decode=await jwt.verify(token,process.env.JWT_SECRET)
            req.user=await User.findById(decode.id)
            next()
        } catch (error) {
            return res.status(401).json({
        success: true,
        message: "Token is invalid",
      });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
          success: true,
          message: "Something went wrong when validating the token",
        });
    }
}

//check if student
exports.isStudent=async(req, res, next)=>{
    try {
        if (req.user.accountType != "Student") {
            return res.status(401).json({
              success: true,
              message: "This is a protected route for students Only",
            });
          }
        next()
    } catch (error) {
        return res.status(401).json({
            success: true,
            message: "User role is not verified",
        });
    }
}

exports.isInstructor=async(req, res, next)=>{
    try {
        if (req.user.accountType != "Instructor") {
            return res.status(401).json({
              success: true,
              message: "This is a protected route for Instructors Only",
            });
          }
          next()
        }
          catch (error) {
            console.log(error);
            return res.status(401).json({
              success: true,
              message: "User role is not verified",
            });
          }
        };
    //Admin
exports.isAdmin = async (req, res, next) => {
};
