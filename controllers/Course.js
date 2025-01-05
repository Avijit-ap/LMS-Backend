import Courses from "../models/Courses"
import Category from "../models/Category"
import User from "../models/User"
import imageUploader from "../utils/imageUploader"

exports.createCourse=async(req,res)=>{
    try {
        const { courseName, courseDescription, whatYouWWillLearn, price, category } = req.body;
        const thumbnail = req.flies.thumbnailImage;
        if (
            !courseName ||
            !thumbnail||
            !courseDescription ||
            !whatYouWWillLearn ||
            !price ||
            !category
          ) {
            return res.status(400).json({
              success: false,
              message: "All fields are required",
            });
          }
          const userId=req.user.id
          if(!userId){
            return res.status(400).json({
                success: false,
                message: "User not found",
              });
          }
          const instructorDetails=await User.findById(userId)
          if(!instructorDetails){
            return res.status(400).json({
                success: false,
                message: "User not found",
              });
          }
          const categoryDetails = await Category.findById(category);
          if (!categoryDetails) {
            return res.status(404).json({
              success: false,
              message: "Category details not found",
            });
          }
          const thumbnailImage = await imageUploader(
            thumbnail,
            process.env.FOLDER_NAME
          );
          if(!thumbnailImage.secure_url){
            return res.status(400).json({
                success: false,
                message: "Thumbnail image upload failed",
              });
          }
          const newCourse = await Courses.create({
            courseName,
            courseDescription,
            whatYouWWillLearn,
            price,
            instructor: instructorDetails._id,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
          });
          await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
              $push: {
                courses: newCourse._id,
              },
            },
            { new: true }
          );
          await Category.findByIdAndUpdate(
            { _id: categoryDetails._id },
            {
              $push: {
                courses: newCourse._id,
              },
            },
            { new: true }
          );
          return res.status(201).json({
            success: true,
            message: "Course created successfully",
            newCourse
          });
}
catch (error) {
        console.log("Error while creating new Course!")
        return res.status(400).json({
            success: false,
            message: error.message||"Error while creating new Course!",
          });
      }
}
exports.showAllCourses = async (res) => {
    try {
      const allCourse = await Courses.find(
        {},
        {
          courseName: true,
          price: true,
          thumbnail: true,
          instructor: true,
          ratingAndReviews: true,
          studentsEnrolled: true,
        }
      )
        .populate("Instructor")
        .exec();
  
      return res.status(200).json({
        success: true,
        message: "Course fetching successfully",
        allCourse,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Error while fetching all courses",
        error: error.message,
      });
    }
  };