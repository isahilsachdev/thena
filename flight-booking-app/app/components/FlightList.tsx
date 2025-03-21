import React from 'react';

type Flight = {
  id: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
};

type SelectedFlights = {
  outbound?: Flight;
  return?: Flight;
};

type SearchData = {
  origin: string;
  destination: string;
  cabinClass: string;
  isReturn: boolean;
};

type FlightListProps = {
  availableFlights: {
    outbound: Flight[];
    return: Flight[];
  };
  selectedFlights: SelectedFlights;
  handleFlightSelection: any;
  searchData: SearchData;
};

/**
 * FlightList component displays available flights based on search criteria and allows users to select flights.
 * 
 * @param {Object} availableFlights - Object containing arrays of outbound and return flights
 * @param {SelectedFlights} selectedFlights - Currently selected outbound and return flights
 * @param {Function} handleFlightSelection - Function to handle flight selection
 * @param {SearchData} searchData - Search criteria including origin, destination, and cabin class
 * @returns {JSX.Element} Rendered flight list with selectable flight options
 */
const FlightList: React.FC<FlightListProps> = ({ 
  availableFlights, 
  selectedFlights, 
  handleFlightSelection, 
  searchData 
}) => {
    return (
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <h2 className="text-xl font-semibold mb-4">
          Available Flights: {searchData.origin.split(' (')[0]} to {searchData.destination.split(' (')[0]} and back
        </h2>
        
        {availableFlights.outbound.length === 0 ? (
          <p>No flights available.</p>
        ) : (
          availableFlights.outbound.map((outboundFlight) => {
            const returnFlights = searchData.isReturn ? availableFlights.return : [];
            return returnFlights.length === 0 ? (
              <div 
                key={outboundFlight.id} 
                className={`bg-[#2A2C2E] p-4 rounded-lg mb-4 border-2 ${
                  selectedFlights.outbound?.id === outboundFlight.id 
                    ? 'border-blue-500' 
                    : 'border-transparent'
                } cursor-pointer transition`}
                onClick={() => handleFlightSelection(outboundFlight, "outbound")}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">{outboundFlight.airline} ({outboundFlight.flightNumber})</h3>
                  <span className="text-xl font-bold">₹{outboundFlight.price.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xl">{outboundFlight.departureTime} → {outboundFlight.arrivalTime}</div>
                    <div className="text-gray-300">Duration: {outboundFlight.duration}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-300">{searchData.cabinClass}</div>
                    <div className="text-gray-300">Available seats: {outboundFlight.availableSeats}</div>
                  </div>
                </div>
                
                <button 
                  className="mt-3 bg-[#1B1D1E] p-2 rounded text-white hover:opacity-[0.8] transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlightSelection(outboundFlight, "outbound");
                  }}
                >
                  Select Flight
                </button>
              </div>
            ) : (
              returnFlights.map((returnFlight) => (
                <div 
                  key={`${outboundFlight.id}-${returnFlight.id}`} 
                  className={`bg-[#2A2C2E] p-4 rounded-lg mb-4 border-2 ${
                    selectedFlights.outbound?.id === outboundFlight.id && selectedFlights.return?.id === returnFlight.id 
                      ? 'border-blue-500' 
                      : 'border-transparent'
                  } cursor-pointer transition`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlightSelection(outboundFlight, "outbound");
                    handleFlightSelection(returnFlight, "return");
                  }}
                >
                  <div className="mb-4">
                    <h3 className="font-bold">Outbound Flight: {outboundFlight.airline} ({outboundFlight.flightNumber})</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-bold">₹{outboundFlight.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xl">{outboundFlight.departureTime} → {outboundFlight.arrivalTime}</div>
                        <div className="text-gray-300">Duration: {outboundFlight.duration}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-300">{searchData.cabinClass}</div>
                        <div className="text-gray-300">Available seats: {outboundFlight.availableSeats}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold">Return Flight: {returnFlight.airline} ({returnFlight.flightNumber})</h3>
                    <div className="flex justify-between mb-1">
                      <span className="text-xl font-bold">₹{returnFlight.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xl">{returnFlight.departureTime} → {returnFlight.arrivalTime}</div>
                        <div className="text-gray-300">Duration: {returnFlight.duration}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-300">{searchData.cabinClass}</div>
                        <div className="text-gray-300">Available seats: {returnFlight.availableSeats}</div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="mt-3 bg-[#1B1D1E] p-2 rounded text-white hover:opacity-[0.8] transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlightSelection(outboundFlight, "outbound");
                      handleFlightSelection(returnFlight, "return");
                    }}
                  >
                    Select Package
                  </button>
                </div>
              ))
            );
          })
        )}
      </div>
    );
};

export default FlightList;
