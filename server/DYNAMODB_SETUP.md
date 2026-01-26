# DynamoDB Setup Guide

## Prerequisites
- AWS Account with DynamoDB access
- AWS SDK configured on your system

## Setting up DynamoDB Tables

### 1. Users Table
Create a DynamoDB table with the following configuration:

**Table Name:** `users`
**Primary Key:** `id` (String)
**Billing Mode:** Pay per request (or Provisioned: 5 RCU/WCU)

**Global Secondary Index:**
- Index Name: `email-index`
- Partition Key: `email` (String)
- Billing Mode: Same as table

### 2. Employees Table
Create a DynamoDB table with the following configuration:

**Table Name:** `employees`
**Primary Key:** `id` (String)
**Billing Mode:** Pay per request (or Provisioned: 5 RCU/WCU)

## Using AWS CLI

```bash
# Create users table
aws dynamodb create-table \
    --table-name users \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=email,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        "[{\"IndexName\":\"email-index\",\"KeySchema\":[{\"AttributeName\":\"email\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}}]" \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1

# Create employees table
aws dynamodb create-table \
    --table-name employees \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

## Environment Variables

Set the following environment variables in your `.env` file:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
```

## Installation

```bash
npm install
```

## Features

The application now supports both MySQL and DynamoDB:

- **MySQL**: Primary database (if available)
- **DynamoDB**: Fallback/redundant database for high availability
- **Hybrid Approach**: Data is written to both databases for redundancy
- **Smart Fallback**: If one database fails, the application tries the other

## API Endpoints

All existing endpoints work with both databases:

- `POST /login` - Login with email and password
- `POST /register` - Register new user
- `GET /users` - Get all users
- `GET /employees` - Get all employees
- `POST /employees` - Create new employee
- `DELETE /employees/:id` - Delete employee
- `POST /daybook/upload` - Upload file

## Running the Server

```bash
npm start
```

Server will run on `http://localhost:3000`
