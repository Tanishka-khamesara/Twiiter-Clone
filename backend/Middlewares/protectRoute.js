import User from "../models/userModel.js";
import jwt from "jsonwebtoken"

export const protectRoute = async (req, res, next) => {
    console.log("hiii");
    try {
        const token = req.cookies.jwt;
        console.log("cookies_check", req.cookies);
        console.log("token_check",token);
        if (!token) {
            const err = new Error("Unauthorized: No Token Provided");
            err.statusCode = 401;
            return next(err);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            const err = new Error("Unauthorized: Invalid Token");
            err.statusCode = 401;
            return next(err);
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            const err = new Error("User Not Found");
            err.statusCode = 404;
            return next(err);
        }
        req.user = user;
        next();

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}