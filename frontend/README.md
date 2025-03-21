# Flight Booking Frontend

## Overview
This is the frontend application for the Flight Booking system, built with React. It provides a user-friendly interface for searching flights, making bookings, and managing user accounts.

## Features
- **User Authentication**: Users can sign up, log in, and manage their profiles.
- **Flight Search**: Users can search for available flights based on their preferences.
- **Booking Management**: Users can create, view, and manage their bookings.
- **Admin Dashboard**: A secret route (`/admin-dashboard`) for administrators to manage the application.

## Installation

### Prerequisites
- Node.js
- npm

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd flight-booking-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application locally:
   ```bash
   npm start
   ```

## API Integration
The frontend communicates with the backend API to fetch flight data and manage bookings. Ensure the backend is running to test the frontend application.

## Deployment
To deploy the frontend application, you can use platforms like Vercel or Netlify. Follow their respective documentation for deployment instructions.

## Note
The `/admin-dashboard` route is a secret route and should only be accessed by authorized personnel.
