import express from "express";
import { protectRoute } from "../Middlewares/protectRoute.js";
import { createPost, deletePost,commentOnPost,likeUnlikePost, getAllPosts,getLikedPosts, getFollowingPosts, getUserPosts } from "../controllers/postControllers.js";

const postRoutes = express.Router();

postRoutes.get("/all", getAllPosts)
postRoutes.get("/likes/:id", protectRoute, getLikedPosts);
postRoutes.get("/following", protectRoute, getFollowingPosts);
postRoutes.get("/user/:username", protectRoute, getUserPosts);
postRoutes.post("/create", protectRoute, createPost);
postRoutes.post("/like/:id", protectRoute, likeUnlikePost);
postRoutes.post("/comment/:id", protectRoute, commentOnPost);
postRoutes.delete("/:id", protectRoute, deletePost);



export default postRoutes;


