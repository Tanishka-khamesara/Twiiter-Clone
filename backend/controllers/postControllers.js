import User from "../models/userModel.js";
import Post from "../models/postModel.js"
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notificationModel.js"

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

export const likeUnlikePost = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            // Unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        } else {
            // Like post
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            });
            await notification.save();

            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
        }
    }
    catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

export const commentOnPost = async (req, res, next) => {
        try {
            const { text } = req.body;
            const postId = req.params.id;
            const userId = req.user._id;

            if (!text) {
                return res.status(400).json({ error: "Text field is required" });
            }
            const post = await Post.findById(postId);

            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }

            const comment = { user: userId, text };

            post.comments.push(comment);
            await post.save();

            res.status(200).json(post);
        
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
export const getAllPosts = async (req, res, next) => {
    try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })//gives latest created post at top
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({ 
				path: "comments.user",//under the comment you have to populate the user
				select: "-password",
			});

		if (posts.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getAllPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

export const getLikedPosts = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User Not Found" });

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } }).populate({
            path: "user",
            select:"-pasword"
        }).populate({
            path: "comments.user",
            select:"-password"
        })
        res.status(200).json(likedPosts);

    } catch {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getFollowingPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const following = user.following;

		const feedPosts = await Post.find({ user: { $in: following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(feedPosts);
	} catch (error) {
		console.log("Error in getFollowingPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: "User not found" });

		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};