import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema(
    {
       videoFile : {
        type : String, //cloudinary URL
        required : true

       },
       thumbnail: {
        type : String,  //cloudinary URL
        required : true

       },
       description : {
        type : String, //cloudinary URL
        required : true  
       },
       duration: {
        type : Number,
        default : 0
       },
       views : {
        type : Number,
        default : 0
       },
       isPublished : {
        type : Boolean,
        default : true
       },
       owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
       }
    },
    {
      timestamp : true
    }
)


export const Video  = mongoose.model("Video", videoSchema)