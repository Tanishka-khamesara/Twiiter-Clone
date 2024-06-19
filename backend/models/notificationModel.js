import mongoose from "mongoose";
// import User from "./userModel";

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }, to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }, type: {
        type: String,
        required: true,
        enum: ['follow', 'like'] //to add comment and reply here
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;