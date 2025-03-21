"use client";

import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { airportsList } from "./utils";
import SeatSelection from "./components/SeatSelection";
import Confirmation from "./components/Confirmation";
import PassengerDetails from "./components/PassengerDetails";
import Payment from "./components/Payment"; // Import Payment component
import FlightList from "./components/FlightList";
import { fetchFlights, getAnalytics } from "./api";
import Header from "./components/Header";
import { useAppContext } from "./AppContext";
import { useRouter } from "next/navigation";

interface SelectedSeats {
  outbound: string[];
  return: string[];
}

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

export default function Home() {
  const { token } = useAppContext(); // Access token from context
  const router = useRouter();

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (!token && currentPath !== '/login' && currentPath !== '/signup') {
      router.push('/login'); // Redirect to login page
    }
  }, [router, token]);
  // State for different views
  const [currentView, setCurrentView] = useState("search"); // search, flights, seatSelection, passengerDetails, confirmation

  const [searchData, setSearchData] = useState({
    origin: "AGX",
    destination: "AMD",
    departureDate: "2025-03-27",
    returnDate: "2025-05-29",
    isReturn: false,
    passengers: 2,
    cabinClass: "Economy",
  });
  
  // Dropdown states
  const [originDropdown, setOriginDropdown] = useState(false);
  const [destinationDropdown, setDestinationDropdown] = useState(false);

  const [paymentDetails, setPaymentDetails] = useState(false);
  
  // Available flights state
  const [availableFlights, setAvailableFlights] = useState({
    outbound: [],
    return: []
  });
  
  // Selected flights
  const [selectedFlights, setSelectedFlights] = useState<SelectedFlights>({
    outbound: {
      airline: '',
      flightNumber: '',
      departureTime: '',
      arrivalTime: '',
      duration: '',
      price: 0,
    },
    return: {
      airline: '',
      flightNumber: '',
      departureTime: '',
      arrivalTime: '',
      duration: '',
      price: 0,
    }
  });  
  
  // Passenger details
  const [passengers, setPassengers] = useState([{ name: "", email: "" }]);
  console.log('passengers', passengers)
  // Seat selection
  
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeats>({
    outbound: [],
    return: [],
  });  
  
  // Handle search form submission
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Generate mock flights for outbound journey
    const outboundFlights = await fetchFlights(
      searchData.origin,
      searchData.destination,
      searchData.departureDate
    );

    // Generate mock flights for return journey if applicable
    const returnFlights = searchData.isReturn ? 
      await fetchFlights(
        searchData.destination,
        searchData.origin,
        searchData.returnDate
      ) : [];

    setAvailableFlights({
      outbound: outboundFlights,
      return: returnFlights
    });
    
    setCurrentView("flights");
  };
  
  // Handle flight selection
  const handleFlightSelection = (flight: 'string', type: 'string') => {
    setSelectedFlights((prevSelectedFlights: SelectedFlights) => {
      const updatedSelectedFlights = {
        ...prevSelectedFlights,
        [type]: flight,
      };
  
      // Generate empty seat selections for the number of passengers
      const seats = Array(searchData.passengers).fill().map(() =>
        String.fromCharCode(65 + Math.floor(Math.random() * 6)) + (1 + Math.floor(Math.random() * 30))
      );
  
      setSelectedSeats((prevSelectedSeats) => ({
        ...prevSelectedSeats,
        [type]: seats,
      }));
  
      // If this is a one-way trip OR we've selected both outbound and return flights
      if (!searchData.isReturn || (updatedSelectedFlights.outbound && updatedSelectedFlights.return)) {
        setCurrentView("seatSelection");
      }

      toast.success('Flight selected successfully!');
      return updatedSelectedFlights;
    });
  };
  
  // Handle passenger details form change
  const handlePassengerChange = (index: number, field: string, value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengers(updatedPassengers);
  };
  
  // Handle booking confirmation
  const handleBookingConfirmation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentView("payments");
    toast.success('Passengar details added successfully!');
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    let total = 0;
    if (selectedFlights.outbound) {
      total += selectedFlights.outbound.price * searchData.passengers;
    }
    if (selectedFlights.return) {
      total += selectedFlights.return.price * searchData.passengers;
    }
    return total;
  };
  
  // Filter airports based on query
  const filterAirports = (query: string) => {
    return airportsList.filter(
      (airport) =>
        airport.airport_name.toLowerCase().includes(query.toLowerCase()) ||
        airport.city_name.toLowerCase().includes(query.toLowerCase()) ||
        airport.IATA_code.toLowerCase().includes(query.toLowerCase())
    );
  };
  
  // Reset booking and go back to search
  const handleNewSearch = () => {
    setCurrentView("search");
    setSelectedFlights({ outbound: { airline: '', flightNumber: '', departureTime: '', arrivalTime: '', duration: '', price: 0 }, return: undefined });
    setSelectedSeats({ outbound: [], return: [] });
    setPassengers([{ name: "", email: "" }]);
  };
  
  return (
    <>
      <Header />
      <div className="min-h-screen p-8 pb-20 flex flex-col items-center gap-8 bg-[#1B1D1E] text-white">
        {/* Search Form */}
        {currentView === "search" && (
          <form onSubmit={handleSearch} className="flex flex-col gap-4 w-full max-w-lg bg-[#2A2C2E] p-6 rounded-lg relative">
            <h2 className="text-xl font-semibold mb-2">Search Flights</h2>
            
            {/* Flight Type Selection */}
            <div className="flex gap-4 mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!searchData.isReturn}
                  onChange={() => setSearchData({ ...searchData, isReturn: false, returnDate: "" })}
                  className="mr-2"
                />
                One Way
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={searchData.isReturn}
                  onChange={() => setSearchData({ ...searchData, isReturn: true })}
                  className="mr-2"
                />
                Round Trip
              </label>
            </div>
            
            {/* Origin Dropdown */}
            <div className="relative">
              <label className="block text-sm mb-1">From</label>
              <input
                type="text"
                placeholder="Origin"
                className="text-white p-2 rounded w-full text-black"
                required
                value={searchData.origin}
                onChange={(e) => {
                  setSearchData({ ...searchData, origin: e.target.value });
                  setOriginDropdown(true);
                }}
                onFocus={() => setOriginDropdown(true)}
                onBlur={() => setTimeout(() => setOriginDropdown(false), 200)}
              />
              {originDropdown && searchData.origin && (
                <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto z-10">
                  {filterAirports(searchData.origin).length > 0 ? (
                    filterAirports(searchData.origin).map((airport) => (
                      <li
                        key={airport.IATA_code}
                        onClick={() => {
                          setSearchData({ ...searchData, origin: `${airport.airport_name} (${airport.IATA_code})` });
                          setOriginDropdown(false);
                        }}
                        className="text-black p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {airport.airport_name} ({airport.IATA_code}) - {airport.city_name}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500">No results found</li>
                  )}
                </ul>
              )}
            </div>

            {/* Destination Dropdown */}
            <div className="relative">
              <label className="block text-sm mb-1">To</label>
              <input
                type="text"
                placeholder="Destination"
                className="text-white p-2 rounded w-full text-black"
                required
                value={searchData.destination}
                onChange={(e) => {
                  setSearchData({ ...searchData, destination: e.target.value });
                  setDestinationDropdown(true);
                }}
                onFocus={() => setDestinationDropdown(true)}
                onBlur={() => setTimeout(() => setDestinationDropdown(false), 200)}
              />
              {destinationDropdown && searchData.destination && (
                <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto z-10">
                  {filterAirports(searchData.destination).length > 0 ? (
                    filterAirports(searchData.destination).map((airport) => (
                      <li
                        key={airport.IATA_code}
                        onClick={() => {
                          setSearchData({ ...searchData, destination: `${airport.airport_name} (${airport.IATA_code})` });
                          setDestinationDropdown(false);
                        }}
                        className="text-black p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {airport.airport_name} ({airport.IATA_code}) - {airport.city_name}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500">No results found</li>
                  )}
                </ul>
              )}
            </div>
            
            {/* Date Selection */}
            <div>
              <label className="block text-sm mb-1">Departure Date</label>
              <input 
                type="date" 
                className="text-white p-2 rounded w-full text-black" 
                required 
                value={searchData.departureDate} 
                onChange={(e) => setSearchData({ ...searchData, departureDate: e.target.value })} 
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            {searchData.isReturn && (
              <div>
                <label className="block text-sm mb-1">Return Date</label>
                <input 
                  type="date" 
                  className="text-white p-2 rounded w-full text-black" 
                  required 
                  value={searchData.returnDate} 
                  onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })} 
                  min={searchData.departureDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            )}
            
            {/* Passengers */}
            <div>
              <label className="block text-sm mb-1">Passengers</label>
              <input 
                type="number" 
                min="1" 
                max="9" 
                className="text-white p-2 rounded w-full text-black" 
                value={searchData.passengers} 
                onChange={(e) => {
                  const numPassengers = parseInt(e.target.value) || 1;
                  setSearchData({ ...searchData, passengers: numPassengers });

                  const updatedPassengers = Array.from({ length: numPassengers }, () => ({ name: "", email: "" }));
                  setPassengers(updatedPassengers);
                }}
              />
            </div>
            
            {/* Cabin Class */}
            <div>
              <label className="block text-sm mb-1">Cabin Class</label>
              <select 
                className="text-white p-2 rounded w-full text-black" 
                value={searchData.cabinClass} 
                onChange={(e) => setSearchData({ ...searchData, cabinClass: e.target.value })}
              >
                <option>Economy</option>
                <option>Premium Economy</option>
                <option>Business</option>
                <option>First</option>
              </select>
            </div>
            
            <button type="submit" className="bg-[#1B1D1E] p-2 rounded text-white hover:opacity-[0.8] transition">Search Flights</button>
          </form>
        )}

        {/* Flight List */}
        {currentView === "flights" && (
          <FlightList availableFlights={availableFlights} selectedFlights={selectedFlights} handleFlightSelection={handleFlightSelection} searchData={searchData} />
        )}

        {/* Seat Selection */}
        {currentView === "seatSelection" && (
          <SeatSelection
            selectedFlights={selectedFlights} 
            selectedSeats={selectedSeats} 
            setSelectedSeats={setSelectedSeats} 
            setCurrentView={setCurrentView} 
            searchData={searchData}
          />
        )}
        
        {/* Passenger Details */}
        {currentView === "passengerDetails" && (
          <PassengerDetails passengers={passengers} handlePassengerChange={handlePassengerChange} selectedSeats={selectedSeats} selectedFlights={selectedFlights} setCurrentView={setCurrentView} handleBookingConfirmation={handleBookingConfirmation} calculateTotalPrice={calculateTotalPrice} />
        )}
        
        {/* Render Payment component */}
        {currentView === "payments" && <Payment searchData={searchData} selectedFlights={selectedFlights} setPaymentDetails={setPaymentDetails} setCurrentView={setCurrentView} calculateTotalPrice={calculateTotalPrice} />}

        {/* Confirmation Page */}
        {currentView === "confirmation" && (
          <Confirmation selectedFlights={selectedFlights} searchData={searchData} passengers={passengers} selectedSeats={selectedSeats} paymentDetails={paymentDetails} calculateTotalPrice={calculateTotalPrice} handleNewSearch={handleNewSearch} />
        )}
      </div>
    </>
  );
}
