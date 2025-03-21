# System Architecture
The system architecture consists of the following components:
- **Frontend**: Built with React, responsible for user interactions and displaying flight information.
- **Backend**: Node.js and Express server handling API requests, authentication, and database interactions.
- **Database**: A database (e.g., PostgreSQL) for storing user and flight data.

# API Documentation
## Endpoints
- **GET /api/flights**: Retrieve a list of flights.
- **POST /api/bookings**: Create a new booking.
- **GET /api/users**: Retrieve user information.
- **POST /api/auth/login**: Authenticate a user.

# Setup and Deployment Instructions

## Prerequisites
- Node.js
- npm

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd flight-booking-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application locally:
   ```bash
   npm start
   ```

## Deployment on Vercel
1. Go to the Vercel dashboard and create a new project.
2. Link your GitHub repository.
3. Configure environment variables as needed.
4. Deploy the project.
