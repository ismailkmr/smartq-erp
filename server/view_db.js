const mysql = require('mysql2/promise');
const fs = require('fs');

async function viewDatabase() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: 'node_task_db'
    };

    try {
        const connection = await mysql.createConnection(config);
        const data = {
            database: 'node_task_db',
            tables: {}
        };

        const [tables] = await connection.query('SHOW TABLES');
        const tableNames = tables.map(row => Object.values(row)[0]);

        for (const tableName of tableNames) {
            const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
            data.tables[tableName] = rows;
        }

        fs.writeFileSync('db_data.json', JSON.stringify(data, null, 2));
        console.log('Database content saved to db_data.json');

        await connection.end();
    } catch (error) {
        console.error('Error viewing database:', error.message);
    }
}

viewDatabase();
