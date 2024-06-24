import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";
import dotenv from "dotenv";
import connectMongodb from "./db/connectMongodb.js";
import { ErrorMiddleware } from "./Middlewares/ErrorMiddleware.js";
import cookieParser from "cookie-parser";
import { protectRoute } from "./Middlewares/protectRoute.js";
import { v2 as cloudinary } from "cloudinary";
import postRoutes from "./routes/postRoutes.js";
import cors from 'cors';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const Port = process.env.PORT || 5000;

const corsOptions = {
    origin: ['http://localhost:3000/',"https://twiiter-clone-hclr.vercel.app"] ,
    
    credentials: true,
};

app.use(cors(corsOptions)); // Enable CORS with specific options
// app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", protectRoute, userRoutes);
app.use("/api/posts", protectRoute, postRoutes);

app.use(ErrorMiddleware);

app.listen(Port, () => {
    console.log(`Server is up and running on port ${Port}`);
    connectMongodb();
});

// Static files and SPA fallback (for production)
if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}
