// index.js

import express from 'express';
import dotenv from 'dotenv'
import connectDB from './db/connectDB.js';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// database connection
connectDB();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.get('/', (req, res) => {
  res.send('Business app backend');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
