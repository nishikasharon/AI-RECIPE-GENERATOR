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

