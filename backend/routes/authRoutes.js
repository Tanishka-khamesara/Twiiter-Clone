import express from "express";
import { getMe, login, logout, signup } from "../controllers/authController.js";
import { protectRoute } from "../Middlewares/protectRoute.js";

const router = express.Router();

router.get("/me",protectRoute, getMe);
//sign up route-----------------------------------------------------------------------------
router.post("/signup", signup);

//log in route------------------------------------------------------------------------------------

router.post("/login", login);

//logout -------------------------------------------------------------------------------------------

router.post("/logout", logout);


export default router;