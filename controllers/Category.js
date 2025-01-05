import Category from "../models/Category";

exports.createCategory=async(req,res)=>{
    const {name,description}=req.body;  
    if(!name || !description){  
        return res.status(400).json({message:"All fields are required"});
    }
    try {
        //check existing category
    const checkExistingCategory=await Category.findOne({name:name});
    if(checkExistingCategory){
        return res.status(400).json({message:"Category already exists"});
    }
    //save category
    const saveCategory=await Category.create({
        name:name,
        description:description,
    })
    return res.status(200).json({
        message:"Category created successfully",
        saveCategory
    });
    } catch (error) {
        console.log("Error while creating Category!")
        return res.status(500).json({message:"Internal server error",
            errorMessage:error.message || "Error message not available"
        });
    }
    
}

exports.showAllCategory=async(req,res)=>{
    try {
        // const {name,description}=req.body
        // if(!name || !description){
        //     return res.status(400).json({message:"All fields are required"});
        // }
        const showAllCategory=await Category.find({},{name:true, description:true});
        return res.status(200).json({
            message:"Category fetched successfully",
            showAllCategory
        });
    } catch (error) {
        console.log("Something went wrong while finding all categories!")
        return res.status(500).json({
            message:"Internal server error",
            errorMessage:error.message || "Error message not available"
        });
    }
}

