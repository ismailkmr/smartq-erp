const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// DynamoDB Configuration
const dynamodbClient = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const dynamodb = DynamoDBDocumentClient.from(dynamodbClient, {
    marshallOptions: {
        removeUndefinedValues: true,
        convertEmptyValues: false,
        convertClassInstanceToMap: true,
    },
    unmarshallOptions: {
        wrapNumbers: false,
    }
});

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// DynamoDB Helper Functions
const USERS_TABLE = 'users';
const EMPLOYEES_TABLE = 'employees';

// Get user from DynamoDB
async function getUserFromDynamoDB(email) {
    try {
        const params = {
            TableName: USERS_TABLE,
            IndexName: 'email-index',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        };
        const result = await dynamodb.send(new QueryCommand(params));
        return result.Items && result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
        console.error('DynamoDB get user error:', error);
        return null;
    }
}

// Put user to DynamoDB
async function putUserToDynamoDB(userId, name, email, password) {
    try {
        const params = {
            TableName: USERS_TABLE,
            Item: {
                id: userId,
                email: email,
                name: name,
                password: password,
                created_at: new Date().toISOString()
            }
        };
        await dynamodb.send(new PutCommand(params));
        return true;
    } catch (error) {
        console.error('DynamoDB put user error:', error);
        return false;
    }
}

// Get all users from DynamoDB
async function getAllUsersFromDynamoDB() {
    try {
        const params = {
            TableName: USERS_TABLE
        };
        const result = await dynamodb.send(new ScanCommand(params));
        return result.Items || [];
    } catch (error) {
        console.error('DynamoDB scan users error:', error);
        return [];
    }
}

// Get all employees from DynamoDB
async function getAllEmployeesFromDynamoDB() {
    try {
        const params = {
            TableName: EMPLOYEES_TABLE
        };
        const result = await dynamodb.send(new ScanCommand(params));
        return result.Items ? result.Items.sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date)) : [];
    } catch (error) {
        console.error('DynamoDB scan employees error:', error);
        return [];
    }
}

// Put employee to DynamoDB
async function putEmployeeToDynamoDB(employeeId, name, position, department, expiry_date) {
    try {
        const params = {
            TableName: EMPLOYEES_TABLE,
            Item: {
                id: employeeId,
                name: name,
                position: position,
                department: department || '',
                expiry_date: expiry_date,
                created_at: new Date().toISOString()
            }
        };
        await dynamodb.send(new PutCommand(params));
        return true;
    } catch (error) {
        console.error('DynamoDB put employee error:', error);
        return false;
    }
}

// Delete employee from DynamoDB
async function deleteEmployeeFromDynamoDB(employeeId) {
    try {
        const params = {
            TableName: EMPLOYEES_TABLE,
            Key: {
                id: employeeId
            }
        };
        await dynamodb.send(new DeleteCommand(params));
        return true;
    } catch (error) {
        console.error('DynamoDB delete employee error:', error);
        return false;
    }
}

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'node_task_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.json({
        message: "Hello Fathima Ismail, the Node.js API is working!",
        status: "success",
        timestamp: new Date().toLocaleString()
    });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', req.body);

    try {
        let user = null;

        // Try MySQL first
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            if (rows.length > 0) {
                user = rows[0];
            }
        } catch (mysqlError) {
            console.log('MySQL query failed, trying DynamoDB:', mysqlError.message);
        }

        // If not found in MySQL, try DynamoDB
        if (!user) {
            user = await getUserFromDynamoDB(email);
        }

        if (user) {
            // In a real app, you should compare hashed passwords (e.g., using bcrypt)
            if (password === user.password) {
                res.json({
                    success: true,
                    message: 'Login successful',
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Registration attempt:', req.body);

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    try {
        let existingUser = null;

        // Check MySQL first
        try {
            const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            if (existingUsers.length > 0) {
                existingUser = existingUsers[0];
            }
        } catch (mysqlError) {
            console.log('MySQL query failed, checking DynamoDB:', mysqlError.message);
        }

        // If not found in MySQL, check DynamoDB
        if (!existingUser) {
            existingUser = await getUserFromDynamoDB(email);
        }

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const userId = `user_${Date.now()}`;
        let success = false;

        // Insert to MySQL
        try {
            const insertQuery = 'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)';
            await pool.query(insertQuery, [userId, name, email, password]);
            success = true;
        } catch (mysqlError) {
            console.log('MySQL insert failed, trying DynamoDB:', mysqlError.message);
        }

        // Also insert to DynamoDB for redundancy
        await putUserToDynamoDB(userId, name, email, password);

        res.json({
            success: true,
            message: 'Registration successful'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

app.get('/users', async (req, res) => {
    try {
        let users = [];

        // Try MySQL first
        try {
            const [mysqlUsers] = await pool.query('SELECT id, name, email, created_at FROM users');
            users = mysqlUsers;
        } catch (mysqlError) {
            console.log('MySQL query failed, trying DynamoDB:', mysqlError.message);
        }

        // If MySQL failed or returned no users, try DynamoDB
        if (users.length === 0) {
            users = await getAllUsersFromDynamoDB();
            users = users.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                created_at: u.created_at
            }));
        }

        res.json({
            success: true,
            count: users.length,
            users: users
        });
    } catch (error) {
        console.error('Fetch users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

// Employee Routes

// Get all employees
app.get('/employees', async (req, res) => {
    try {
        let employees = [];

        // Try MySQL first
        try {
            const [mysqlEmployees] = await pool.query('SELECT * FROM employees ORDER BY expiry_date ASC');
            employees = mysqlEmployees;
        } catch (mysqlError) {
            console.log('MySQL query failed, trying DynamoDB:', mysqlError.message);
        }

        // If MySQL failed or returned no employees, try DynamoDB
        if (employees.length === 0) {
            employees = await getAllEmployeesFromDynamoDB();
        }

        res.json({
            success: true,
            employees: employees
        });
    } catch (error) {
        console.error('Fetch employees error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch employees',
            error: error.message
        });
    }
});

// Add new employee
app.post('/employees', async (req, res) => {
    const { name, position, department, expiry_date } = req.body;

    if (!name || !position || !expiry_date) {
        return res.status(400).json({
            success: false,
            message: 'Name, Position, and Expiry Date are required'
        });
    }

    try {
        const employeeId = `employee_${Date.now()}`;
        let insertId = employeeId;

        // Insert to MySQL
        try {
            const query = 'INSERT INTO employees (id, name, position, department, expiry_date) VALUES (?, ?, ?, ?, ?)';
            const [result] = await pool.query(query, [employeeId, name, position, department || '', expiry_date]);
            insertId = result.insertId || employeeId;
        } catch (mysqlError) {
            console.log('MySQL insert failed, trying DynamoDB:', mysqlError.message);
        }

        // Also insert to DynamoDB for redundancy
        await putEmployeeToDynamoDB(employeeId, name, position, department, expiry_date);

        res.json({
            success: true,
            id: insertId,
            message: 'Employee added successfully'
        });
    } catch (error) {
        console.error('Add employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add employee',
            error: error.message
        });
    }
});

// Delete employee
app.delete('/employees/:id', async (req, res) => {
    try {
        // Delete from MySQL
        try {
            await pool.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
        } catch (mysqlError) {
            console.log('MySQL delete failed, trying DynamoDB:', mysqlError.message);
        }

        // Also delete from DynamoDB
        await deleteEmployeeFromDynamoDB(req.params.id);

        res.json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete employee',
            error: error.message
        });
    }
});

// DayBook Routes
// Add new entry with image upload
app.post('/daybook/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Image upload failed',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
