import mongoose from "mongoose";

const connectMongodb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDb connected :${conn.connection.host}`)
        
    } catch(error) {
        console.log(`Error connection to mongoDb:${Error.message}`);
        process.exit(1);  //it means there is some errors
    }
}

export default connectMongodb;