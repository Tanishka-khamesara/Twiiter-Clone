import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';

import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res,next) => {
   
        const { fullname, username, email, password } = req.body;

        try {
            const { fullname, username, email, password } = req.body;
            console.log(req.body)
            // if (!fullname || !username || !email || !password) {
            //     const err = new Error("All fields are required");
            //     err.statusCode = 400; // Bad Request
            //     return next(err);
            // }
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
                res.status(201).json({
                    _id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				email: newUser.email,
				followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImg,
				coverImg: newUser.coverImg,
                })
            }
            else {
                const err = new Error("Invalid User Data");
                err.statusCode = 400;
                 return next(err);
            }
            
            
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
}


export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Check if both username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const user = await User.findOne({ username });

        // Check if the user exists
        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        // Check if the password is correct
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Generate token and set cookie
        generateTokenAndSetCookie(user._id, res);

        // Respond with user details
        res.status(200).json({
            _id: user.id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        // Log the error for debugging purposes (optional)
        console.error(error);

        // Respond with a generic error message
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({
            message:"Logged out Succesfully!"
        })
    } catch (error) {
        console.error(error);

        // Respond with a generic error message
        res.status(500).json({ error: "Internal Server Error" });
   }
}

export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch {
        console.error(error);

        // Respond with a generic error message
        res.status(500).json({ error: "Internal Server Error" });
    }
}
