import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary"


export const getUserProfile = async (req, res,next) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            const err = new Error("User Not Found");
            err.statusCode = 404;
            return next(err);
        }
        res.status(200).json(user);
    } catch {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getSuggestedUsers = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const userFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match: {
                    _id:{$ne:userId}
                }
            },
            {$sample:{size:10}}
        ])

        const filteredUsers = users.filter(user => !userFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4);

        suggestedUsers.forEach((user) => (user.password = null))
        
        res.status(200).json(suggestedUsers)
    } catch {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const followUnfollowUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id); //my id and its me

        if (id === req.user._id.toString()) {
            const err = new Error("You Can't Follow or Unfollow Yourself");
            err.statusCode = 400;
            return next(err);
        }
        if (!userToModify || !currentUser) {
            const err = new Error("user not found");
            err.statusCode = 400;
            return next(err);
        }
        const isFollowing = currentUser.following.includes(id);
        if (isFollowing) {
            //unfollow the user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            // const newNotification = new Notification({
            //     type: 'unfollow',
            //     from: req.user._id,
            //     to:userToModify._id
            // })

            // await newNotification.save();
            //todo return the id of the user in response
            res.status(200).json({
                message:"User Unfollowed Succesfully",
            })

        } else {
            //follow the user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

             //send notification to the user
            const newNotification = new Notification({
                type: 'follow',
                from: req.user._id,
                to:userToModify._id
            })

            await newNotification.save();

            res.status(200).json({
                message:"User followed Succesfully",
            })
           
        }

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateUserProfile = async (req, res, next) => {
    const { fullname, email, username, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            const err = new Error("User not Found!");
            err.statusCode = 404;
            return next(err);
        }
        if (!newPassword && currentPassword || !currentPassword && newPassword) {
            const err = new Error("current and new Password Required!");
            err.statusCode = 400;
            return next(err);
        }
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                const err = new Error("current password is incorrect");
                err.statusCode = 400;
                return next(err);
            }
            if (newPassword.length < 6) {
                const err = new Error("Password must be at least 6 Characters long");
                err.statusCode = 400;
                return next(err);
            }

            // Generate a hash for the new password
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(newPassword, salt);
        }
        if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }
        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();
        user.password = null;
        return res.status(200).json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
