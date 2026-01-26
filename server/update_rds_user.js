const mysql = require('mysql2/promise');

async function updateRDSUser() {
    const config = {
        host: 'node-task-db.cr8mkwqu4d1m.ap-south-1.rds.amazonaws.com',
        user: 'admin',
        password: 'password123',
        database: 'node_task_db'
    };

    try {
        const connection = await mysql.createConnection(config);
        console.log('Connected to RDS.');

        // First, Ensure tables exist (Run setup logic)
        console.log('Ensuring tables exist...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check if user exists
        const [rows] = await connection.query('SELECT * FROM users LIMIT 1');

        if (rows.length > 0) {
            const userId = rows[0].id;
            console.log(`Updating user ID ${userId} email to admin@edmail.com...`);
            await connection.query('UPDATE users SET email = ? WHERE id = ?', ['admin@edmail.com', userId]);
            console.log('Update successful.');
        } else {
            console.log('No user found to update. Inserting new user...');
            await connection.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                ['Admin User', 'admin@edmail.com', '123456']);
            console.log('Insert successful.');
        }

        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

updateRDSUser();
