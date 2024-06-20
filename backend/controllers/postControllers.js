import User from "../models/userModel.js";
import Post from "../models/postModel.js"
import {v2 as cloudinary} from "cloudinary"

export const createPost = async (req, res,next) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();
        const user = await User.findById(userId);

        if (!user) {
            const err = new Error("User not Found");
            err.statusCode=404;
            return next(err);
        }
        if (!text && !img) {
            const err = new Error("Post must have text or image");
            err.statusCode=400;
            return next(err);
        }
        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }
        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deletePost = async (req, res,next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            const err = new Error("post not Found");
            err.statusCode(404);
            return next(err);
        }
        if (post.user.toString() !== req.user._id.toString()) {
            const err = new Error("You Are Not Authorized To Delete It");
            err.statusCode(401);
            return next(err);
        }
        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message:"Post Deleted Succesfully",
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}