import mongoose from "mongoose"
import dotenv from "dotenv"
//require("dotenv").config();
dotenv.config()

async function dbConnect(){
    try {
        const client= await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log("DB CONNECT DONE")
        return client

    } catch (error) {
        console.log("something went wrong!",error)
        process.exit(1);
    }
}
export default dbConnect;
//A
/**
 * const dbconnect=()=>{
    mongoose.connect(process.env.MONGODB_URI,{
       useNewUrlParser:true,
       useUnifiedTopology:true
           })
            .then(()=>console.log("Database connected successfully"))
             .catch((error)=>{
                         console.log("Db is not connected")
                         console.error(error.message);
                        process.exit(1);
                    }
 */