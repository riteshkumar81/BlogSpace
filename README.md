# Blogging Platform

## Project Description
A full-stack blogging platform with user authentication, built with Node.js, Express, MongoDB, and JWT.

## Current Implemented Features (Phase 1)
- User registration
- User login
- JWT authentication
- Protected route to get current user
- MongoDB connection
- RESTful API for authentication
- Basic error handling
- Health check endpoint

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- dotenv
- cors
- nodemon (development)

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (v4 or higher)

## MongoDB Setup
1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service (default port 27017)
3. The database name is `blogging_platform` as specified in `.env`

## Installation Commands
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the development server
npm run dev
```
Or for production:
```bash
npm start
```

## Environment Variable Setup
Create a `.env` file in the `server` directory with the following:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogging_platform
JWT_SECRET=change_this_to_a_secure_secret
JWT_EXPIRE=30d
```
See `.env.example` for reference.

## API Health Endpoint
```
GET /api/health
```
Response:
```json
{
  "success": true,
  "message": "Blogging Platform API is running"
}
```

## Authentication Endpoints
- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login a user
- **GET /api/auth/me** - Get current user (protected, requires JWT)

## Current Project Structure
```
Blogging-Platform/
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └/authController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   └── User.js
│   │
│   ├── routes/
│   │   └── authRoutes.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

## How to Start the Backend
1. Ensure MongoDB is running.
2. Navigate to the `server` directory.
3. Run `npm install` if dependencies are not installed.
4. Run `npm run dev` for development or `npm start` for production.
5. The server will start on `http://localhost:5000`.

## Verification Steps Performed
1. Verified MongoDB connection successful.
2. Tested health check endpoint - returns 200 OK.
3. Tested user registration - returns 201 on success.
4. Tested duplicate registration - returns 400 error.
5. Tested login with correct credentials - returns 200 OK with JWT.
6. Tested login with incorrect credentials - returns 401 error.
7. Tested accessing `/me` with valid JWT - returns 200 OK with user data.
8. Tested accessing `/me` without token - returns 401 error.
9. Tested accessing `/me` with invalid token - returns 401 error.
10. Verified that `.env` is ignored by git.
11. Verified that passwords are never returned in API responses.
12. Verified that there are no obvious runtime errors.

## Notes
- The server uses environment variables for configuration.
- Passwords are hashed using bcryptjs before storage.
- JWT is used for authentication, with the user ID stored in the payload.
- The authentication middleware verifies the JWT and attaches the user to the request.
- Basic error handling is in place to avoid exposing stack traces.
