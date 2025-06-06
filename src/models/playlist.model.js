import mongoose , {Schema} from "mongoose";

const playlistSchema = new Schema({
    name: {
        type : String,
        required: true
    },
    description: {
        type : String,
        required: true
    },
    videos: [
        {
        type : Schema.Types.ObjectId,
        ref: "Video"    
    }
],
    owner: {
        type : String,
         ref: "Video"    
    },

},{timestamps: true})



export const Playlist = mongoose.model("Playlist", playlistSchema)