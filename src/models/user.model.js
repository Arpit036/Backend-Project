import mongoose, {schema} from mongoose ;
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new Schema(
    {
        username: {
            type : String,
            required: true,
            unique: true,
            lowercase : true,
            trim : true,
            index: true
        },
        email: {
            type : String,
            required: true,
            unique: true,
            lowercase : true,
            trim : true
             
        },
        fullname: {
            type : String,
            required: true,
            trim : true,
            index: true
        },
        avatar: {
            type : String, //coudinary url
            required: true
           
        },
        coverImage:{
            type: String 
        },
        watchHistory :[ {
            type: Schema.Type.ObjectId,
            ref : "Video"
        }
    ],
        password : {
            type : String,
            required : [true, 'password is required']
        },
        refershToken : {
            type : String
        },

    },
    {
        timestamps: true
    }
)

userSchema.pre("save",async function(next) {
    if(!this.isModified("password")) return next();

    
    this.password = bcrypt.hash(this.password, 10)
    next()
})

export const User = mongoose.mmodel("User", userSchema)