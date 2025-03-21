import React from 'react';

/**
 * Represents a passenger's information.
 * 
 * @type {Object}
 * @property {string} name - The full name of the passenger.
 * @property {string} email - The email address of the passenger.
 */
type Passenger = {
  name: string;
  email: string;
};

/**
 * Represents flight information.
 * 
 * @type {Object}
 * @property {string} airline - The name of the airline.
 * @property {string} flightNumber - The flight number.
 * @property {string} departureTime - The departure time of the flight.
 * @property {string} arrivalTime - The arrival time of the flight.
 * @property {string} duration - The duration of the flight.
 * @property {number} price - The price of the flight.
 */
type Flight = {
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
};

/**
 * Represents the selected flights for a booking.
 * 
 * @type {Object}
 * @property {Flight} outbound - The outbound flight selected.
 * @property {Flight} [return] - The return flight selected (optional).
 */
type SelectedFlights = {
  outbound: Flight;
  return?: Flight;
};

/**
 * Represents the selected seats for a booking.
 * 
 * @type {Object}
 * @property {string[]} outbound - The selected seats for the outbound flight.
 * @property {string[]} [return] - The selected seats for the return flight (optional).
 */
type SelectedSeats = {
  outbound: string[];
  return?: string[];
};

/**
 * Props for the PassengerDetails component.
 * 
 * @type {Object}
 * @property {Passenger[]} passengers - The list of passengers.
 * @property {function} handlePassengerChange - Function to handle changes to passenger information.
 * @property {SelectedSeats} selectedSeats - The selected seats for the booking.
 * @property {SelectedFlights} selectedFlights - The selected flights for the booking.
 * @property {function} setCurrentView - Function to set the current view.
 * @property {function} handleBookingConfirmation - Function to handle booking confirmation.
 * @property {function} calculateTotalPrice - Function to calculate the total price of the booking.
 */
type PassengerDetailsProps = {
  passengers: Passenger[];
  handlePassengerChange: (index: number, field: "name" | "email", value: string) => void;
  selectedSeats: SelectedSeats;
  selectedFlights: SelectedFlights;
  setCurrentView: (view: string) => void;
  handleBookingConfirmation: any;
  calculateTotalPrice: () => number;
};

/**
 * Component for entering passenger details.
 * 
 * @param {PassengerDetailsProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const PassengerDetails: React.FC<PassengerDetailsProps> = ({
  passengers,
  handlePassengerChange,
  selectedSeats,
  selectedFlights,
  setCurrentView,
  handleBookingConfirmation,
  calculateTotalPrice,
}) => {
  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6">Passenger Details</h2>

      <form onSubmit={handleBookingConfirmation} className="bg-[#2A2C2E] p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Enter Passenger Information</h3>

        {passengers.map((passenger, index) => (
          <div key={index} className="mb-6 p-4 rounded">
            <h4 className="font-medium mb-3">Passenger {index + 1}</h4>

            <div className="mb-3">
              <label className="block text-sm mb-1">Full Name</label>
              <input
                type="text"
                required
                className="text-white p-2 rounded w-full text-black border-1 border-white"
                value={passenger.name}
                onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                required
                className="text-white p-2 rounded w-full text-black border-1 border-white"
                value={passenger.email}
                onChange={(e) => handlePassengerChange(index, "email", e.target.value)}
              />
            </div>

            <div>
              <p className="mb-1 text-sm">
                Assigned Seat (Outbound): <span className="font-bold">{selectedSeats.outbound[index]}</span>
              </p>
              {selectedFlights.return && !!selectedSeats.return?.[index] && (
                <p className="text-sm">
                  Assigned Seat (Return): <span className="font-bold">{selectedSeats.return?.[index]}</span>
                </p>
              )}
            </div>
          </div>
        ))}

        <div className="mt-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => setCurrentView("seatSelection")}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
          >
            Back
          </button>

          <div className="text-xl">
            Total: ₹<span className="font-bold">{calculateTotalPrice().toLocaleString()}</span>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
          >
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default PassengerDetails;
