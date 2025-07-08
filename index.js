import express from 'express';
import dotenv from 'dotenv'


import connectDB from './db/connectDB.js';
import userRoute from './routes/User.routes.js'
import commentRoute from './routes/Comment.routes.js'
import commentReplyRoute from './routes/CommentReply.routes.js'
import postRoute from './routes/Post.routes.js'
import complaintRoute from './routes/UserComplaint.routes.js';
import complaintReplyRoute from './routes/ComplaintReply.routes.js';
import aiRoutes from "./routes/Ai.routes.js";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for body parser and cors error
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


// Database connection
connectDB();


app.use('/api/users', userRoute);// user routes contain login/register related route
app.use('/api/posts', postRoute);// post related routes for user as well as admin
app.use('/api/comments', commentRoute);// comments related routes for user as well as admin
app.use('/api/comment-replies', commentReplyRoute);// reply related routes for user as well as admin
app.use('/api/complaints', complaintRoute);// complaint related routes for user as well as admin
app.use('/api/complaint-replies', complaintReplyRoute);// coplaint reply related routes for user as well as admin
app.use("/api/ai", aiRoutes);// routes for api hugging face api


// Start is running..
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

