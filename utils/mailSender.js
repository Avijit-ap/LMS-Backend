import { createTransport } from "nodemailer";


const mailSender=async(email,title,body)=>{
    try {
        let transpoter=createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })
     
        let info=await transpoter.sendMail({
            from:`StudyNotion`,
            to: `${email}`,
            subject:`${title}`,
            html:`${body}`,
        })

       console.log(info)

    } catch (error) {
        console.log(error.message);
    }
}

export default mailSender;