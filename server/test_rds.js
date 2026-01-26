const mysql = require('mysql2/promise');

async function testConnection() {
    const config = {
        host: 'node-task-db.cr8mkwqu4d1m.ap-south-1.rds.amazonaws.com',
        user: 'admin',
        password: 'password123',
        database: 'node_task_db'
    };

    try {
        console.log('Connecting to RDS...');
        const connection = await mysql.createConnection(config);
        console.log('Connected successfully!');
        const [rows] = await connection.query('SHOW TABLES');
        console.log('Tables:', rows);
        await connection.end();
    } catch (error) {
        console.error('Connection failed:', error.message);
    }
}

testConnection();
