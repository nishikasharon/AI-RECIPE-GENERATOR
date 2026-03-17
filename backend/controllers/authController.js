import User from '../models/User.js';
import UserPreference from '../models/UserPreference.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d'}
    );
};

// Register new user
export const register = async (req, res, next) => {
    try{
        const { email, password, name} = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, password and name'
            });
        }

        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({ email, password, name });

        // Create default preferences
        await UserPreference.upsert(user.id, {
            dietary_restrictions: [],
            allergies: [],
            preferred_cuisines: [],
            default_servings: 4,
            measurement_unit: 'metric'
        });

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// Login user
export const login = async (req, res, next) =>{
    try {
        const { email, password} = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invali credentials'
            });
        }

        // Verify password
        const isPasswornValid = await User.verifyPassword(password, user.password_hash);

        if (!isPasswornValid) {
            return res.status.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Logic successful',
            data: {
                user:{
                    id: user.id,
                    email: user.email,
                    name: user.name
                },
                token
            }
        });
    } catch (error){
        next (error);
    }
};