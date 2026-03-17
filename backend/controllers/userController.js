import User from '../models/User.js';
import UserPreference from '../models/UserPreference.js';

// Get user profile
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
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
export const updateProfile = async (req, res, next) => {
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

// Update user preferences
export const updateUserPreference = async (req, res, next) => {
    try{
        const preferences = await UserPreference.upsert(req.user.id, req.body);

        res.json({
            success: true,
            message: 'Preferences updated successfully',
            data: { preferences }
        });
    } catch (error){
        next(error);
    }
}

// Change password
export const changePassword = async (req, res, next) => {
    try{
        const {currentPassword, newPassword} = req.body;

        if (!currentPassword || !newPassword){
            return res.json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        // Verify current password
        const user = await User.findByEmail(req.user.email);
        const isValid = await User.verifyPassword(currentPassword, user.password_hash);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Curent password is incorrect'
            });
        }

        //Update the password
        await User.updatePassword(req.user.id, newPassword);

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error){
        next(error);
    }
}

// Delete account
export const deleteAccount = async (req, res, next) => {
    try {
        await User.delete(req.user.id);

        res.json({
            success: true,
            message: 'Acccount deleted successfully'
        });
    } catch (error){
        next(error);
    }
}