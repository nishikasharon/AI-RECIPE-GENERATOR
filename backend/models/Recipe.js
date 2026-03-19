import db from '../config/db.js';

class Recipe {
    // Create a new recipe with ingredient and nutrition

    static async create(userId, recipeData) {
        const client = await db.pool.connect(); 

        try {
            await client.query('BEGIN');

            const {
                name, 
                description,
                cuisine_type,
                difficulty,
                prep_time,
                cook_time,
                servings,
                instructions,
                dietary_tags = [],
                user_notes,
                image_url,
                ingredients =[],
                nutrition = {}
            } = recipeDate;

            // Insert recipe
            const recipeResult = await client.query(
                `INSERT INTO recipes
            (user_id, name, description, cuisine_type, difficulty, prep_time, cook_time, servings, instructions, dietary_tags, user_notes, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`,
                [userId, name, description, cuisine_type, difficulty, prep_time, cook_time, servings,instructions, dietary_tags, user_notes, image_url]
            );

            const recipe = recipeResult.rows[0];
        }
    }
}