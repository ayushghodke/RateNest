# Rox Store Rating Application

A web application for rating and reviewing stores. Built with React, Node.js, Express, and MySQL.

## Features

- User authentication (signup, login)
- Different user roles (admin, user, store owner)
- Store listing and details
- Rating and reviewing stores
- User profile management
- Store owner dashboard

## Prerequisites

- Node.js (v14+)
- MySQL (v8+)

## Setup Instructions

### Database Setup

1. Make sure MySQL is running on your machine
2. Update the database config in `backend/config/database.js` if needed

### Backend Setup

1. Navigate to the backend directory
   ```
   cd backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run the setup script to create the database and default admin user
   ```
   npm run setup
   ```

4. Start the development server
   ```
   npm run dev
   ```

The backend will run on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory
   ```
   cd frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

The frontend will run on `http://localhost:3000`.

## Default Admin Credentials

- Email: ayushghodke123@gmail.com
- Password: 123456

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stores` - Get stores owned by the user
- `GET /api/users/ratings` - Get user's ratings

### Stores
- `GET /api/stores` - Get all stores
- `GET /api/stores/top` - Get top rated stores
- `GET /api/stores/:id` - Get a single store
- `GET /api/stores/:id/ratings` - Get store ratings
- `POST /api/stores/:id/ratings` - Add a rating to a store

### Store Owners
- `POST /api/store-owner/stores` - Create a new store
- `PUT /api/store-owner/stores/:id` - Update a store
- `DELETE /api/store-owner/stores/:id` - Delete a store

## User Roles

- **Admin**: Can manage all stores and users
- **Store Owner**: Can create and manage their stores
- **User**: Can view and rate stores 
