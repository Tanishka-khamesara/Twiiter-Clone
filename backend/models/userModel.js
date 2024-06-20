import mongoose from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength:[3,"username Must contain atleast 3 Characters"],
    },
    fullname: {
        type: String,
        required: true,
        minLength:[3," name Must contain atleast 3 Characters"],
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "Password must contain atleast 6 characters"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate:validator.isEmail
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default:[]
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default:[]
        }
    ],
    profileImg: {
        type: String,
        default:"",
    },
    coverImg: {
        type: String,
        default:"",
    },
    bio: {
        type: String,
        default:"",
    },
    link: {
        type: String,
        default:"",
    },
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default:[],
        }
    ]
}, { timestamps: true })


const User = mongoose.model("User", userSchema);

export default User;