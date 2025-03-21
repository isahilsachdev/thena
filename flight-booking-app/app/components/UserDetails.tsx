'use client';

import React, { useEffect, useState } from 'react';
import { fetchUserProfile, cancelBooking } from '../api';

/**
 * UserDetails component displays user profile information and booked flights.
 * Allows users to view their personal information and manage flight bookings.
 * 
 * @returns {JSX.Element} The rendered user details page
 */
const UserDetails = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches the user's profile data from the API.
   * Updates state with the retrieved data or error message.
   * 
   * @returns {Promise<void>}
   */
  const fetchUserDetails = async (): Promise<void> => {
    try {
      const response = await fetchUserProfile();
      setUserDetails(response.data.profile);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effect hook to fetch user details on component mount.
   */
  useEffect(() => {
    fetchUserDetails();
  }, []);

  /**
   * Handles the cancellation of a flight booking.
   * Makes an API call to cancel the booking and refreshes user data.
   * 
   * @param {string} bookingId - The ID of the booking to cancel
   * @returns {Promise<void>}
   */
  const handleCancelBooking = async (bookingId: string) => {
    try {
      setLoading(true);
      await cancelBooking(bookingId);
      fetchUserDetails();
    } catch (err) {
      setError('Failed to cancel booking');
    }
  }
  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[#1B1D1E]">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
    </div>
  );  
  return (
    <div className="max-w-4xl mx-auto">
      {/* User Info Card */}
      <div className="bg-[#2A2C2E] text-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">User Information</h2>
        <div className="flex flex-col gap-2">
          <p><span className="font-bold">Name:</span> {userDetails.name || 'N/A'}</p>
          <p><span className="font-bold">Email:</span> {userDetails.email || 'N/A'}</p>
          <p><span className="font-bold">Account Created:</span> {new Date(userDetails.created_at).toLocaleString()}</p>
        </div>
      </div>

      {/* Booked Flights */}
      <div className="bg-[#2A2C2E] text-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Booked Flights</h2>
        {userDetails.flights.length > 0 ? (
          <ul className="space-y-4">
            {userDetails.flights.map((flight: { id: string; flight_number: string; origin: string; destination: string; departure_date: string; arrival_date: string; airline: string }) => (
              <div>
                <li key={flight.id} className="border-[1px] border-gray-500 p-4 rounded-lg shadow">
                  <p><span className="font-bold">Flight Number:</span> {flight.flight_number}</p>
                  <p><span className="font-bold">Airline:</span> {flight.airline}</p>
                  <p><span className="font-bold">Origin:</span> {flight.origin}</p>
                  <p><span className="font-bold">Destination:</span> {flight.destination}</p>
                  <p><span className="font-bold">Departure:</span> {new Date(flight.departure_date).toLocaleString()}</p>
                  <p><span className="font-bold">Arrival:</span> {new Date(flight.arrival_date).toLocaleString()}</p>
                  <button
                    type="button"
                    onClick={() => handleCancelBooking(flight.id)}
                    className="px-4 py-2 bg-red-400 rounded hover:opacity[0.4] transition mt-2"
                  >
                    Cancel Booking
                  </button>
                </li>
              </div>
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