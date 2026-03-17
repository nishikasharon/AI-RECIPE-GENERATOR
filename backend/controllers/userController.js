import User from '../models/User.js';
import UserPreference from '../models/UserPreference.js';

// Get user profile
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findByEmail(req.user.id);
        const preferences = await UserPreference.findByUserId(req.user.id);

        res.json({
            success: true,
            data: {
                user,
                preferences
            }
        });
    } catch(error){
        next(error);
    }
} 

// Update user profile
export const constupdateProfile = async (req, res, next) => {
    try {
        const {name, email} = req.body;

        const user = await User.update(req.user.id,{ name, email });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data:{ user }
        });
    } catch (error){
        next(error);
    }
}