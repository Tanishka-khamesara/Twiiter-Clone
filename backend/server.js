import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import { connect } from "mongoose";
import connectMongodb from "./db/connectMongodb.js";
import { ErrorMiddleware } from "./Middlewares/ErrorMiddleware.js";
import cookieParser from "cookie-parser";
import { protectRoute } from "./Middlewares/protectRoute.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const Port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users",protectRoute, userRoutes);

app.listen(Port, () =>{console.log(`server is up and running on port ${Port}`)
    connectMongodb()
});

app.use(ErrorMiddleware);