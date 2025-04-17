# Bloody Organ - Backend Server

This is the backend server for the Bloody Organ donation platform. It provides APIs for managing users, donors, and transplant requests.

## Features

- User authentication and authorization
- Donor registration and management
- Transplant request management
- Admin dashboard functionality
- Geospatial search for donors
- Statistics and reporting

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Navigate to the server directory:
   ```bash
   cd server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bloody_organ
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Users
- GET `/api/users` - Get all users (admin only)
- GET `/api/users/profile` - Get user profile
- PATCH `/api/users/profile` - Update user profile
- PATCH `/api/users/change-password` - Change password
- DELETE `/api/users/profile` - Delete user account
- GET `/api/users/statistics` - Get user statistics (admin only)

### Donors
- POST `/api/donors` - Register as a donor
- GET `/api/donors` - Get all donors (admin only)
- GET `/api/donors/:id` - Get donor by ID
- PATCH `/api/donors/:id/status` - Update donor status
- GET `/api/donors/search` - Search donors

### Transplant Requests
- POST `/api/requests` - Create new transplant request
- GET `/api/requests` - Get all requests (admin only)
- GET `/api/requests/my-requests` - Get user's requests
- GET `/api/requests/:id` - Get request by ID
- PATCH `/api/requests/:id/status` - Update request status (admin only)
- POST `/api/requests/:id/match` - Match donor to request (admin only)
- GET `/api/requests/search` - Search requests

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:
```json
{
  "message": "Error message here",
  "error": "Detailed error information (in development)"
}
```

## Security

- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control
- Input validation and sanitization

## Development

To start the development server with hot-reload:
```bash
npm run dev
```

## Production

To start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 