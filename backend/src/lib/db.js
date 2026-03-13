import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        if (!MONGO_URI) throw new Error("MONGO_URI not set");


        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err}`);
        process.exit(1);    // 1 -> fails ; 0 -> success
    }
}