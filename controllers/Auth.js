import User from "../models/User"
import otpGenerator from "otp-generator"
import Otp from "../models/Otp"

// Send OTP handler 
async function sendOtp(req, res) {
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
const otpSave= await Otp.create({
    email:email,
    otp:otp
})
console.log("DB response for OTP save",otpSave)
res.json({
    success:true,
    message:"OTP Generated successfully!",
},{
    status:201
})
}

    catch (error) {
        console.log("Something went wrong", error.message)
        res.json({
            success:false,
            message:error.message,
        },
    {
        status:500
    })
    }
}
export default sendOtp;