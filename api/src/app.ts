import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/dbConn.js';
import { errorHandler } from './middleware/errorHandler.js';

const app: Express = express();

connectDB();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true
}));
app.use(cookieParser());

// routes


// error
app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB");
    app.listen(8000, () => {
        console.log(`Server listening on port: 8000`);
    });
});

mongoose.connection.on('error', err => {
    console.log(err);
});