// index.js

import express from 'express';
import dotenv from 'dotenv'
import connectDB from './db/connectDB.js';
import userRoute from './routes/userRoutes.js'
import commentRoute from './routes/commentRoutes.js'
import postRoute from './routes/postRoutes.js'



dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
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

