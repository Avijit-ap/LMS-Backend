import User from "../models/User"
import otpGenerator from "otp-generator"
import Otp from "../models/Otp"
import {bcrypt} from "bcrypt"
import jwt from "jsonwebtoken"

//SEND OTP
exports.sendOtp=async(req, res) =>{
    try {
        const { email } = req.body
        //check if user already exist
        const checkUserExist = await User.findone({ email: email })
        if (checkUserExist) {
            console.log("User already exist!")
            res.json({
                success: false,
                message: "User already exist!",
            }, {
                status: 404
            })
        }
        //generate OTP
        // let otp= otpGenerator(6,
        //      { lowerCaseAlphabets: false,
        //         upperCaseAlphabets: false, 
        //         specialChars: false })
        // console.log("OTP generated:",otp)

        //check if th OTP is already exist in the DB 
        // const checkOtpExist=await Otp.findone({
        //     otp:otp
        // })

        let checkOtpExist = true
        while (checkOtpExist) {
            const otp = otpGenerator(6,
                {
                    lowerCaseAlphabets: false,
                    upperCaseAlphabets: false,
                    specialChars: false
                })
            console.log("OTP generated:", otp)
            checkOtpExist = await Otp.findone({
                otp: otp
            })

        }
        const otpSave = await Otp.create({
            email: email,
            otp: otp
        })
        console.log("DB response for OTP save", otpSave)
        res.json({
            success: true,
            message: "OTP Generated successfully!",
        }, {
            status: 201
        })
    }

    catch (error) {
        console.log("Something went wrong", error.message)
        res.json({
            success: false,
            message: error.message,
        },
            {
                status: 500
            })
    }
};
//SIGNUP
exports.signUp=async(req, res) => {  
try {
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp,
    } = req.body;
    if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !confirmPassword ||
        !otp
    ) {
        return res.status(403).json({
            success: false,
            message: "All Files are required",
        });
    }
const checkUserExist= await User.findone({email:email})
if(checkUserExist){
    console.log("user already exist!")
    return res.status(400).json({
        success: false,
        message: "Email already exist!",
    });
}
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password and confirm password does not match!",
        });
    }
const recentOTP=await Otp.find({email}).
                        sort({createdAt:-1}).
                        limit(1)

//if there is no OTP for that email
if(recentOTP.length==0 || recentOTP[0].otp!=otp){
    return res.status(400).json({
        success: false,
        message: "OTP not found OR NOT MATCH!",
    });



}

const hashPassword= await bcrypt.create(password, 10)

const additionalProfileDetails=await Profile.create({
    gender: null,
    dateOfBirth: null,
    about: null,
    contactNumber: null,
  });


const saveUser= await User.create({
    firstName,
    lastName,
    email,
    password:hashPassword,
    accountType,
    contactNumber,
    additionalDetails:additionalProfileDetails._id,
    image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,

})

return res.status(201).json({
    success: true,
    message: "User created successfully!",
    saveUser,
});
} catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message,
    });
}
}
//SIGNIN
exports.signIn= async(req,res)=>{
    try {
    const{email,password}= await req.body
    //CHECK IF EMAIL AND PASS NOT EMPTY
    if(!email || !password)
    {
        return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
    }
//CHECK IF USER ALREADY EXIST
    const user= await User.findone({email})
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
    }
//COMPARE THE PASSWORD FOR VALIDATION
    const isPasswordValid= await bcrypt.compare(password,user.password)    
    if(!isPasswordValid){
        return res.status(401).json({
            success:false,
            message:"Invalid password"
        })
    }
//CREATE PAYLOAD FOR TOKEN
const payload={
    email:user.email,
    id:user._id,
    accountType:user.accountType
}
const token= jwt.sign(payload,process.env.JWT_SECRET,{
    expiresIn:'2h',
})
//save the token in user object
user.token=token
user.password=undefined
//options for cookie lifetime
const options = {
    expires: new Date(Date.now() + 3 * 24 * 3600 * 1000),
    httpOnly: true,
  };

  res.cookie("token", token, options).status(200).json({
    success: true,
    token,
    user,
    message: "Log in Successfully",
  });
}catch (error) {
console.log(error)
    return res.status(500).json({
    success: false,
    message: "Login failed!, try again",
    });  
}
}
