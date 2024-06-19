import express from "express";
import { getUserProfile,followUnfollowUser,getSuggestedUsers,updateUserProfile} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:username", getUserProfile);
router.get("/suggested", getSuggestedUsers);
router.post("/follow/:id", followUnfollowUser);
router.post("/update", updateUserProfile);


export default router;