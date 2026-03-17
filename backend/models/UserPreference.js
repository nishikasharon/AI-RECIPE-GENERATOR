import db from '../config/db.js';

class UserPreference{
    //Create or update user preferences

    static async upsert(userId, preferences){
        const {
            dietary_restrictions = [],
            allergies = [],
            preferred_cuisines = [],
            default_servings = 4,
            measurement_unit = 'metric'
        } = preferences;

        const result = await db.query(
            `INSERT INTO user_preferences
        (user_id, dietary_restrictions, allergies, preferred_cuisines, default_servings, measurement_unit)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id)
        DO UPDATE SET
            dietary_restriction = $2,
            allergies = $3,
            preferred_cuisines = $4,
            default_servings = $5,
            measurement_unit = $6
        RETURNING *`,
            [userId, dietary_restrictions, allergies, preferred_cuisines, default_servings, measurement_unit]
        );

        return result.rows[0];
    }
}