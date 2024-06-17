import express from "express";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import { connect } from "mongoose";
import connectMongodb from "./db/connectMongodb.js";
import { ErrorMiddleware } from "./Middlewares/ErrorMiddleware.js";

dotenv.config();

const app = express();
const Port = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(Port, () =>{console.log(`server is up and running on port ${Port}`)
    connectMongodb()
});

app.use(ErrorMiddleware);