import { findOne, findByIdAndUpdate } from "../models/User";
import mailSender from "../utils/mailSender";
import { hash } from "bcrypt";

//resetPasswordToken

export async function resetPasswordToken(req ,res){
    try {
        const email =req.body.email;
        const user=await findOne({email:email})
        if(!user)
        {
            return res.status(403).json({
                success:false,
                message:"User is not registered yet."
            })
        }
        const token=crypto.randomUUID();
        const updateDetails=await findByIdAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExpires:Date.now()+5*60*1000,
            },
            {
                new:true,
            }
        )
        const url=`process.env.BASE_URL/${token}`;
        await mailSender(
            email,
            "Reset Your Password",
            `Password reset link:${url}`
        );
        return res.status(200).json({
            success:true,
            message:"Email sent successfully. Please open your email and change password"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Facing error while sending email"
        })
    }
}

//ResetPassword
export async function resetPassword(req ,res){
    try {
        const {password,confirmPassword,token}=req.body;
        if(password != confirmPassword)
        {
            return res.status(401).json({
                success:false,
                message:"Password not matching",
            })
        }
        const userDetails=await findOne({toekn:token});
        if(!userDetails){
            return res.status(401).json({
                success:false,
                message:"Token is invalid",
            })
        }
        if(userDetails.resetPasswordExpires< Date.now())
        {
            return res.status(401).json({
                success:false,
                message:"Token is expired",
            })
        }
        const hashedPassword= await hash(password, 10);

        await findByIdAndUpdate(
            {token:token},
            {password:hashedPassword
            },
            {new:true},
        )

        return res.status(200).json({
            success:true,
            message:"Password reset successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Something went wrong while resetting password"
        })
    }
}