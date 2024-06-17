import express from "express";
import { login, logout, signup } from "../controllers/authController.js";

const router = express.Router();


//sign up route-----------------------------------------------------------------------------
router.post("/signup", signup);

//log in route------------------------------------------------------------------------------------

router.post("/login", login);

//logout -------------------------------------------------------------------------------------------

router.post("/logout", logout);


export default router;