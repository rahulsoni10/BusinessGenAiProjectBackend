// index.js

import express from 'express';
import dotenv from 'dotenv'
import connectDB from './db/connectDB.js';
import userRoute from './routes/userRoutes.js'
import commentRoute from './routes/commentRoutes.js'
import postRoute from './routes/postRoutes.js'
import userComplaintRoute from './routes/userComplaintRoutes.js';
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


app.use('/api/users',userRoute);
app.use('/api/posts', postRoute);

// base route for complaints
// there will be two route for complaint one for user, another for admin to resolve complaint
app.use('/api/complaints',userComplaintRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

