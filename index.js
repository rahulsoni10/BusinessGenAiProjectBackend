// index.js

import express from 'express';
import dotenv from 'dotenv'


import connectDB from './db/connectDB.js';
import userRoute from './routes/userRoutes.js'
import commentRoute from './routes/commentRoutes.js'
import commentReplyRoute from './routes/commentReplyRoutes.js'
import postRoute from './routes/postRoutes.js'
import userComplaintRoute from './routes/userComplaintRoutes.js';
import complaintReplyRoute from './routes/complaintReplyRoutes.js';
import aiRoutes from "./routes/aiRoutes.js";
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


// database connection
connectDB();


app.use('/api/users', userRoute);
app.use('/api/posts', postRoute)
app.use('/api/comments', commentRoute);
app.use('/api/comment-replies', commentReplyRoute);
app.use('/api/complaint', userComplaintRoute);
app.use('/api/complaint-replies', complaintReplyRoute);
app.use("/api/ai", aiRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

