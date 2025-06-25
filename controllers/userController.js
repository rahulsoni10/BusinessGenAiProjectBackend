import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        console.log(req.body);

        const { user_name, email, password, role } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({ user_name, email, password: hashPassword, role });
        await user.save();

        // token generation for user
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });


        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                user_name: user.user_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });


        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                user_name: user.user_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
