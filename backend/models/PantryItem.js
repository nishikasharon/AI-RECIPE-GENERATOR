import db from '../config/db.js';

class PantryItem{
    // Create a new pantry item

    static async create(userId, itemData) {
        const { name, quantity, unit, category, expiry_date, is_running_low = false} = itemData;

        const result = await db.query(
             `INSERT INTO pantry_items
        (user_id, name, quantity, unit, category, expiry_date, is_running_low )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`
            [userId, name, quantity, unit, category, expiry_date, is_running_low ]
        ); 

        return result.rows[0];
    }

    // Get all pantry items for a user

    static async findByUserId(userId, filters = {}) {
        let query = 'SELECT * FROM pantry_items WHERE user_id = $1';
        const params = [userId];
        let paramCount = 1;

        if (filters.category) {
            paramCount++;
            query += `AND category = $${paramCount}`;
            params.push(filters.category);
        }

        if (filters.is_running_low !== undefined) {
            paramCount++;
            query += `AND running_low = $${paramCount}`;
            params.push(filters.is_running_low);
        }

        if (filters.search) {
            paramCount++;
            query += `AND name ILIKE = $${paramCount}`;
            params.push(`%${filters.search}%`);
        }

        query += 'ORDER BY created_at DESC';

        const result = await db.query(query,params);
        return result.rows;
    }

    // Get items expiring soon (within next 7 days)

    static async getExpirySoon(userId, days = 7) {
        const result = await db.query(
            `SELECT * FROM pantry_items
        WHERE user_id = $1
        AND expiry_date IS NOT NULL
        AND expiry_date <= CURRENT_DATE + INTERVAL '${days} days'
        AND expiry_date >= CURRENT_DATE
        ORDER BY expiry_date ASC`,
            [userId]
        );

        return result.rows;
    }

    // Get pantry items by ID

    static async findByUserId(id, userId) {
        const result = await db.query(
            'SELECT * FROM pantry_items WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        return result.rows[0];
    }
}