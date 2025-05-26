import mongoose, {schema} from mongoose ;

const userSchema = new Schema(
    {
        username: {
            type : String,
            require: true,
            unique: true,
            lowercase : true,
            trim : true,
            index: true
        }
    }
)

export const User = mongoose.mmodel("User", userSchema)