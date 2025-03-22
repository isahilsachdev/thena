

import React from 'react';

type Flight = {
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
};

type SelectedFlights = {
  outbound: Flight;
  return?: Flight;
};

type SearchData = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  cabinClass: string;
  passengers: number;
};

type Passenger = {
  name: string;
  email: string;
};

type SelectedSeats = {
  outbound: string[];
  return?: string[];
};

type ConfirmationProps = {
  paymentDetails: any;
  selectedFlights: SelectedFlights;
  searchData: SearchData;
  passengers: Passenger[];
  selectedSeats: SelectedSeats;
  calculateTotalPrice: () => number;
  handleNewSearch: () => void;
};

/**
 * Confirmation component displays the booking confirmation page with flight, passenger, 
 * and payment details after a successful booking.
 * 
 * @param {PaymentDetails} paymentDetails - Details of the payment transaction
 * @param {SelectedFlights} selectedFlights - Information about the selected outbound and optional return flights
 * @param {SearchData} searchData - Original search parameters including origin, destination, dates, etc.
 * @param {Passenger[]} passengers - Array of passenger information
 * @param {SelectedSeats} selectedSeats - Information about selected seats for all passengers
 * @param {Function} calculateTotalPrice - Function to calculate the total price of all flights
 * @param {Function} handleNewSearch - Function to start a new flight search
 * @returns {JSX.Element} Rendered confirmation page
 */
const Confirmation: React.FC<ConfirmationProps> = ({
  paymentDetails,
  selectedFlights,
  searchData,
  passengers,
  selectedSeats,
  calculateTotalPrice,
  handleNewSearch,
}) => {
  return (
    <div className="w-full max-w-2xl">
      <div className="bg-green-700 p-4 rounded-lg mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p>Thank you for your booking. Your confirmation code is: <span className="font-mono font-bold">{Math.random().toString(36).slice(2, 10).toUpperCase()}</span></p>
      </div>
      
      <div className="bg-[#2A2C2E] p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
        <div className='border border-[1px] border-gray-500 shadow-lg rounded w-fit p-4'>
          <p>Payment Method: Credit Card</p>
          <p>Card Number: **** **** **** {paymentDetails?.cardNumber?.slice(-4)}</p>
          <p>Amount: ₹{paymentDetails?.amount?.toLocaleString()}</p>
        </div>
        <h3 className="text-xl font-semibold my-4">Flight Details</h3>
        
        {/* Outbound flight */}
        <div className="mb-4 p-4 border border-[1px] border-gray-500 shadow-lg rounded">
          <h4 className="font-medium mb-2">Outbound Flight</h4>
          <div className="flex justify-between mb-1">
            <span>{selectedFlights.outbound.airline} ({selectedFlights.outbound.flightNumber})</span>
            <span>{new Date(searchData.departureDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold mb-1">
            <span>{searchData.origin.split(' (')[0]}</span>
            <span>→</span>
            <span>{searchData.destination.split(' (')[0]}</span>
          </div>
          <div className="flex justify-between">
            <span>{selectedFlights.outbound.departureTime}</span>
            <span>{selectedFlights.outbound.arrivalTime}</span>
          </div>
          <div className="mt-2 text-gray-300">
            <p>Duration: {selectedFlights.outbound.duration}</p>
            <p>Cabin Class: {searchData.cabinClass}</p>
          </div>
        </div>
        
        {/* Return flight if applicable */}
        {selectedFlights.return && (
          <div className="mb-4 p-4 border border-[1px] border-gray-500 shadow-lg rounded">
            <h4 className="font-medium mb-2">Return Flight</h4>
            <div className="flex justify-between mb-1">
              <span>{selectedFlights.return.airline} ({selectedFlights.return.flightNumber})</span>
              <span>{searchData.returnDate ? new Date(searchData.returnDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold mb-1">
              <span>{searchData.destination.split(' (')[0]}</span>
              <span>→</span>
              <span>{searchData.origin.split(' (')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span>{selectedFlights.return.departureTime}</span>
              <span>{selectedFlights.return.arrivalTime}</span>
            </div>
            <div className="mt-2 text-gray-300">
              <p>Duration: {selectedFlights.return.duration}</p>
              <p>Cabin Class: {searchData.cabinClass}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Passenger Details */}
      <div className="bg-[#2A2C2E] p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Passenger Details</h3>
        
        <div className='flex space-x-4 flex-wrap'>
          {passengers.map((passenger, index) => (
            <div key={index} className="mb-4 p-3 border border-[1px] border-gray-500 shadow-lg rounded w-fit">
              <h4 className="font-medium">Passenger {index + 1}</h4>
              <p>Name: {passenger.name}</p>
              <p>Email: {passenger.email}</p>
              <div className="mt-2">
                <p>Outbound Seat: <span className="font-bold">{selectedSeats.outbound[index]}</span></p>
                {selectedFlights.return && (
                  <p>Return Seat: <span className="font-bold">{selectedSeats.return ? selectedSeats.return[index] : 'N/A'}</span></p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Payment Summary */}
      <div className="bg-[#2A2C2E] p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Payment Summary</h3>
        
        <div className="flex justify-between mb-2">
          <span>Outbound Flight ({searchData.passengers} passenger{searchData.passengers > 1 ? 's' : ''})</span>
          <span>₹{(selectedFlights.outbound.price * searchData.passengers).toLocaleString()}</span>
        </div>
        
        {selectedFlights.return && (
          <div className="flex justify-between mb-2">
            <span>Return Flight ({searchData.passengers} passenger{searchData.passengers > 1 ? 's' : ''})</span>
            <span>₹{(selectedFlights.return.price * searchData.passengers).toLocaleString()}</span>
          </div>
        )}
        
        <div className="flex justify-between mb-2">
          <span>Taxes & Fees</span>
          <span>₹{Math.floor(calculateTotalPrice() * 0.18).toLocaleString()}</span>
        </div>
        
        <div className="border-t border-gray-600 my-3"></div>
        
        <div className="flex justify-between text-xl font-bold">
          <span>Total Paid</span>
          <span>₹{(calculateTotalPrice() + Math.floor(calculateTotalPrice() * 0.18)).toLocaleString()}</span>
        </div>
        
        <p className="mt-4 text-sm text-gray-400">Payment method: Credit Card (xxxx-xxxx-xxxx-{paymentDetails.cardNumber? paymentDetails.cardNumber.substring(paymentDetails.cardNumber.length-4): 'xxxx'})</p>
      </div>
      
      <div className="mt-6 text-center">
        <button 
          onClick={handleNewSearch}
          className="px-6 py-3 bg-green-600 rounded hover:bg-green-700 transition"
        >
          Book Another Flight
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
