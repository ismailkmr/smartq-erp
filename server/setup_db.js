const mysql = require('mysql2/promise');

async function setupDatabase() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    };

    try {
        // Connect to MySQL server
        const connection = await mysql.createConnection(config);
        console.log('Connected to MySQL server.');
        // Create Database
        await connection.query('CREATE DATABASE IF NOT EXISTS node_task_db');
        console.log('Database "node_task_db" created or already exists.');
        // Switch to the database
        await connection.changeUser({ database: 'node_task_db' });
        // Create Users Table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(createTableQuery);
        console.log('Table "users" created or already exists.');

        // Check if sample user exists
        const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', ['abc@qwe.com']);

        if (rows.length === 0) {
            // Insert Sample User
            const insertUserQuery = `
                INSERT INTO users (name, email, password) 
                VALUES (?, ?, ?)
            `;
            await connection.query(insertUserQuery, ['Fathima Ismail', 'abc@qwe.com', '123456']);
            console.log('Sample user inserted.');
        } else {
            console.log('Sample user already exists.');
        }

        await connection.end();
        console.log('Database setup completed successfully.');

    } catch (error) {
        console.error('Error setting up database:', error);
        console.log('\nIf you have a password for your root user, please let me know.');
    }
}

setupDatabase();
