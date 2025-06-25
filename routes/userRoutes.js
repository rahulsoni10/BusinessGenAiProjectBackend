import express from 'express';
import { register, login } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', register);
router.get('/register',(req,res)=>{
    res.send("register here")
})
router.post('/login', login);

export default router;
