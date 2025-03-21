'use client';
import React, { useEffect } from "react";
import { toast } from "react-toastify";

interface Flight {
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
}

interface SelectedFlights {
  outbound: Flight;
  return?: Flight;
}

interface SelectedSeats {
  outbound: string[];
  return: string[];
}

interface SearchData {
  passengers: number;
  isReturn: boolean;
}

interface SeatSelectionProps {
  selectedFlights: SelectedFlights;
  selectedSeats: SelectedSeats;
  setSelectedSeats: React.Dispatch<React.SetStateAction<SelectedSeats>>;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  searchData: SearchData;
}

/**
 * SeatSelection component allows users to select seats for their flights.
 * It displays seat maps for both outbound and return flights (if applicable).
 * 
 * @param {SelectedFlights} selectedFlights - The flights selected by the user
 * @param {SelectedSeats} selectedSeats - Currently selected seats for outbound and return flights
 * @param {Function} setSelectedSeats - State setter function for updating selected seats
 * @param {Function} setCurrentView - State setter function for changing the current view
 * @param {SearchData} searchData - Search data including number of passengers and return flight status
 * @returns {JSX.Element} Rendered seat selection interface
 */
const SeatSelection: React.FC<SeatSelectionProps> = ({
  selectedFlights,
  selectedSeats,
  setSelectedSeats,
  setCurrentView,
  searchData
}) => {
  /**
   * Shows a success toast when the component mounts to confirm flight selection
   */
  useEffect(() => {
    toast.success('Flight selected successfully!');
  }, [])

  /**
   * Handles the selection and deselection of seats
   * 
   * @param {string} type - Type of flight ("outbound" or "return")
   * @param {string} seat - Seat identifier (e.g., "A1", "B2")
   */
  const handleSeatSelection = (type: "outbound" | "return", seat: string) => {
    setSelectedSeats((prevSelectedSeats) => {
      const seats = prevSelectedSeats[type].includes(seat)
        ? prevSelectedSeats[type].filter((s) => s !== seat)
        : prevSelectedSeats[type].length < searchData.passengers
        ? [...prevSelectedSeats[type], seat]
        : prevSelectedSeats[type];
      return {
        ...prevSelectedSeats,
        [type]: seats,
      };
    });
  };

  /**
   * Validates that the correct number of seats have been selected for all flights
   * 
   * @returns {boolean} True if seat selection is valid, false otherwise
   */
  const validateSeatSelection = () => {
    if (selectedSeats.outbound.length !== searchData.passengers) {
      alert(`Please select ${searchData.passengers} seats for the outbound flight.`);
      return false;
    }
    if (searchData.isReturn && selectedSeats.return.length !== searchData.passengers) {
      alert(`Please select ${searchData.passengers} seats for the return flight.`);
      return false;
    }
    return true;
  };

  /**
   * Handles proceeding to the next step after validating seat selection
   * Shows success toast and changes view if validation passes
   */
  const handleProceed = () => {
    if (validateSeatSelection()) {
      setCurrentView("passengerDetails");
      toast.success('Seats selected successfully!');
    }
  };

  return (
    <div className="w-full max-w-2xl text-center">
      <h2 className="text-2xl font-semibold mb-6">Select Seats</h2>
      <div className="flex space-x-12 justify-center items-center mb-6 w-[600px]">
        <div className="mb-6 w-full">
          <h3 className="text-lg font-medium mb-2">
            Outbound Flight: {selectedFlights.outbound.airline} ({selectedFlights.outbound.flightNumber})
          </h3>
          <div className="bg-[#2A2C2E] p-4 rounded-md inline-block">
            <p className="text-gray-400 mb-2">Cockpit</p>
            {Array.from({ length: 30 }, (_, row) => (
              <div key={row} className="flex justify-center mb-1">
                {Array.from({ length: 3 }, (_, col) => {
                  const seat = String.fromCharCode(65 + col) + (row + 1);
                  return (
                    <button
                      key={seat}
                      className={`m-1 w-8 h-8 p-2 rounded text-center flex items-center justify-center ${
                        selectedSeats.outbound.includes(seat) ? "bg-blue-500" : "bg-gray-700"
                      } hover:opacity-[0.6] transition`}
                      onClick={() => handleSeatSelection("outbound", seat)}
                    >
                      <span className="text-sm">{seat}</span>
                    </button>
                  );
                })}
                <div className="w-8"></div>
                {Array.from({ length: 3 }, (_, col) => {
                  const seat = String.fromCharCode(68 + col) + (row + 1);
                  return (
                    <button
                      key={seat}
                      className={`m-1 w-8 h-8 p-2 rounded text-center flex items-center justify-center ${
                        selectedSeats.outbound.includes(seat) ? "bg-blue-500" : "bg-gray-700"
                      } hover:opacity-[0.6] transition`}
                      onClick={() => handleSeatSelection("outbound", seat)}
                    >
                      <span className="text-sm">{seat}</span>
                    </button>
                  );
                })}
              </div>
            ))}
            <p className="text-gray-400 mt-2">Back of Plane</p>
          </div>
        </div>

        {!!selectedFlights.return && !!selectedFlights.return.airline && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              Return Flight: {selectedFlights.return.airline} ({selectedFlights.return.flightNumber})
            </h3>
            <div className="bg-[#2A2C2E] p-4 rounded-md inline-block">
              <p className="text-gray-400 mb-2">Cockpit</p>
              {Array.from({ length: 30 }, (_, row) => (
                <div key={row} className="flex justify-center mb-1">
                  {Array.from({ length: 3 }, (_, col) => {
                    const seat = String.fromCharCode(65 + col) + (row + 1);
                    return (
                      <button
                        key={seat}
                        className={`m-1 w-8 h-8 p-2 rounded text-center flex items-center justify-center ${
                          selectedSeats.return.includes(seat) ? "bg-blue-500" : "bg-gray-700"
                        } hover:opacity-[0.6] transition`}
                        onClick={() => handleSeatSelection("return", seat)}
                      >
                        {seat}
                      </button>
                    );
                  })}
                  <div className="w-8"></div>
                  {Array.from({ length: 3 }, (_, col) => {
                    const seat = String.fromCharCode(68 + col) + (row + 1);
                    return (
                      <button
                        key={seat}
                        className={`m-1 w-8 h-8 p-2 rounded text-center flex items-center justify-center ${
                          selectedSeats.return.includes(seat) ? "bg-blue-500" : "bg-gray-700"
                        } hover:opacity-[0.6] transition`}
                        onClick={() => handleSeatSelection("return", seat)}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
              ))}
              <p className="text-gray-400 mt-2">Back of Plane</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center space-x-4 items-center w-[600px]">
        <button
          type="button"
          onClick={() => setCurrentView("flights")}
          className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleProceed}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
        >
          Proceed to Passenger Details
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;