<<<<<<< HEAD
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Mongoose Connected...");
    } catch (err) {
        console.log(err);
    }
};

=======
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Mongoose Connected...");
    } catch (err) {
        console.log(err);
    }
};

>>>>>>> 55a0c20f9fe2d1abaa7ec3c0e7733d9f16c87924
export default connectDB;