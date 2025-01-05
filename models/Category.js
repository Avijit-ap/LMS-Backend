import { Schema, model } from "mongoose";

const categorySchema=new Schema({
    course:{
        type:Schema.Types.ObjectId,
        ref:"Course",
    },
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    }
});

export default model("Category",categorySchema);