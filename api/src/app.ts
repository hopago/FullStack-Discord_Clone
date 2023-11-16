import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/dbConn.js';

import { errorHandler } from './middleware/errorHandler.js';

import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import friendRouter from './routes/friendRequestTableRoutes.js';
import blockRouter from "./routes/blockRequestTableRoutes.js";
import serverRouter from './routes/serverRoutes.js';
import conversationRouter from './routes/conversationRoutes.js';
import privateMessageRouter from './routes/messageRoutes.js';
import serverConversationRouter from './routes/serverConversationRoutes.js';
import postRouter from './routes/postRoutes.js';
import commentRouter from './routes/commentRoutes.js';

const app: Express = express();

connectDB();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true
}));
app.use(cookieParser());

// routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/friends', friendRouter);
app.use('/blackList', blockRouter);
app.use('/servers', serverRouter);
app.use('/conversation', conversationRouter);
app.use('/private/messages', privateMessageRouter);
app.use('/servers/conversation', serverConversationRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

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