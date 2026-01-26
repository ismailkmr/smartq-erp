const mysql = require('mysql2/promise');

async function setupEmployeeTable() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'node_task_db'
    };

    try {
        const connection = await mysql.createConnection(config);
        console.log('Connected to database.');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS employees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                position VARCHAR(255) NOT NULL,
                department VARCHAR(255),
                expiry_date DATE NOT NULL,
                status VARCHAR(50) DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await connection.query(createTableQuery);
        console.log('Table "employees" created or already exists.');

        // Insert some sample data if empty
        const [rows] = await connection.query('SELECT * FROM employees');
        if (rows.length === 0) {
            const sampleData = [
                ['John Smith', 'Senior Developer', 'IT', '2026-12-31'],
                ['Sarah Jones', 'HR Manager', 'HR', '2025-06-30'],
                ['Mike Brown', 'Technician', 'Maintenance', '2024-05-15'] // Expired example
            ];

            const insertQuery = 'INSERT INTO employees (name, position, department, expiry_date) VALUES ?';
            await connection.query(insertQuery, [sampleData]);
            console.log('Sample employees inserted.');
        }

        await connection.end();
        console.log('Employee table setup completed.');

    } catch (error) {
        console.error('Error setting up employee table:', error);
    }
}

setupEmployeeTable();
