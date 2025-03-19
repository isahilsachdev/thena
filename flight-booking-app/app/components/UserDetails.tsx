'use client';

import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../api';

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async (): Promise<void> => {
      try {
        const response = await fetchUserProfile();
        setUserDetails(response.data.profile);
      } catch (err: unknown) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* User Info Card */}
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">User Information</h2>
        <div className="flex flex-col gap-2">
          <p><span className="font-bold">Name:</span> {userDetails.name || 'N/A'}</p>
          <p><span className="font-bold">Email:</span> {userDetails.email || 'N/A'}</p>
          <p><span className="font-bold">Account Created:</span> {new Date(userDetails.created_at).toLocaleString()}</p>
        </div>
      </div>

      {/* Booked Flights */}
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Booked Flights</h2>
        {userDetails.flights.length > 0 ? (
          <ul className="space-y-4">
            {userDetails.flights.map((flight: { id: string; flight_number: string; origin: string; destination: string; departure_date: string; arrival_date: string; airline: string }) => (
              <li key={flight.id} className="bg-gray-700 p-4 rounded-lg shadow">
                <p><span className="font-bold">Flight Number:</span> {flight.flight_number}</p>
                <p><span className="font-bold">Airline:</span> {flight.airline}</p>
                <p><span className="font-bold">Origin:</span> {flight.origin}</p>
                <p><span className="font-bold">Destination:</span> {flight.destination}</p>
                <p><span className="font-bold">Departure:</span> {new Date(flight.departure_date).toLocaleString()}</p>
                <p><span className="font-bold">Arrival:</span> {new Date(flight.arrival_date).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No flights booked yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;