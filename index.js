// index.js

import express from 'express';
import dotenv from 'dotenv'
import connectDB from './db/connectDB.js';
import userRoute from './routes/userRoutes.js'
<<<<<<< HEAD
import commentRoute from './routes/commentRoutes.js'
import postRoute from './routes/postRoutes.js'
=======
import cors from 'cors';
>>>>>>> 772d270beb0fda73660cf6834a4fb8fe2f87835e



dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


// database connection
connectDB();


app.use('/api/users',userRoute);
app.use('/api/comments',commentRoute);
app.use('/api/posts',postRoute)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

