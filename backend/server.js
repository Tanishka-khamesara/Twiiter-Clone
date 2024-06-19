import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import { connect } from "mongoose";
import connectMongodb from "./db/connectMongodb.js";
import { ErrorMiddleware } from "./Middlewares/ErrorMiddleware.js";
import cookieParser from "cookie-parser";
import { protectRoute } from "./Middlewares/protectRoute.js";

dotenv.config();

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