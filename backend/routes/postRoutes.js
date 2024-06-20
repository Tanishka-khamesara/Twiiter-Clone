import express from "express";
import { protectRoute } from "../Middlewares/protectRoute.js";
import { createPost, deletePost } from "../controllers/postControllers.js";

const postRoutes = express.Router();

postRoutes.post("/create", protectRoute, createPost);
// postRoutes.post("/like/:id", protectRoute, likeUnlikePost);
// postRoutes.post("/comment/:id", protectRoute, commentOnPost);
postRoutes.delete("/:id", protectRoute, deletePost);



export default postRoutes;


