import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';

import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res,next) => {
   
        const { fullname, username, email, password } = req.body;

        try {
            const { fullname, username, email, password } = req.body;
    
            if (!fullname || !username || !email || !password) {
                const err = new Error("All fields are required");
                err.statusCode = 400; // Bad Request
                return next(err);
            }
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                const err = new Error("UserName Already Taken");
                err.statusCode = 400;
                 return next(err);
            }
            const existingemail = await User.findOne({ email });
            if (existingemail) {
                const err = new Error("Email Already Taken");
                err.statusCode = 400;
                 return next(err);
            }
            //hash password

            const salt = await bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hashSync(password, salt);
            
            const newUser = new User({fullname,username,email, password: hashedPassword });
            // console.log(newUser)

            if (newUser) {
                generateTokenAndSetCookie(newUser._id, res);
                await newUser.save();
            }
            const err = new Error("Invalid User Data");
                err.statusCode = 400;
                 return next(err);
            
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
}


export const login = async (req, res) => {
    res.json({
        message:"login",
    })
}

export const logout = async (req, res) => {
    res.json({
        message:"logout",
    })
}

