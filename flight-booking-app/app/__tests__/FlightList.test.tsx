import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlightList from '../components/FlightList';

describe('FlightList Component', () => {
  const mockHandleFlightSelection = jest.fn();

  const mockAvailableFlights = {
    outbound: [
      {
        id: 'outbound1',
        airline: 'Delta',
        flightNumber: 'DL123',
        departureTime: '10:00 AM',
        arrivalTime: '1:00 PM',
        duration: '3h',
        price: 2500,
        availableSeats: 5,
      },
    ],
    return: [
      {
        id: 'return1',
        airline: 'Delta',
        flightNumber: 'DL456',
        departureTime: '3:00 PM',
        arrivalTime: '6:00 PM',
        duration: '3h',
        price: 2500,
        availableSeats: 5,
      },
    ],
  };

  const mockSelectedFlights = {
    outbound: null,
    return: null,
  };

  const mockSearchData = {
    origin: 'JFK',
    destination: 'LAX',
    cabinClass: 'Economy',
    isReturn: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * @test Ensures that the "Select Flight" button for outbound flights calls the handleFlightSelection function.
   */
  test('calls handleFlightSelection when "Select Flight" button is clicked for outbound flight', () => {
    render(
      <FlightList
        availableFlights={mockAvailableFlights}
        selectedFlights={mockSelectedFlights}
        handleFlightSelection={mockHandleFlightSelection}
        searchData={{ ...mockSearchData, isReturn: false }}
      />
    );

    const selectButton = screen.getByRole('button', { name: /select flight/i });
    expect(selectButton).toBeInTheDocument();

    fireEvent.click(selectButton);

    expect(mockHandleFlightSelection).toHaveBeenCalledWith(mockAvailableFlights.outbound[0], 'outbound');
  });

  /**
   * @test Ensures that the "Select Package" button for outbound and return flights calls the handleFlightSelection function for both flights.
   */
  test('calls handleFlightSelection when "Select Package" button is clicked for outbound and return flights', () => {
    render(
      <FlightList
        availableFlights={mockAvailableFlights}
        selectedFlights={mockSelectedFlights}
        handleFlightSelection={mockHandleFlightSelection}
        searchData={mockSearchData}
      />
    );

    const selectPackageButton = screen.getByRole('button', { name: /select package/i });
    expect(selectPackageButton).toBeInTheDocument();

    fireEvent.click(selectPackageButton);

    expect(mockHandleFlightSelection).toHaveBeenCalledWith(mockAvailableFlights.outbound[0], 'outbound');
    expect(mockHandleFlightSelection).toHaveBeenCalledWith(mockAvailableFlights.return[0], 'return');
  });

  /**
   * @test Verifies that the component renders a message when no outbound flights are available.
   */
  test('renders "No flights available" message when no outbound flights are available', () => {
    render(
      <FlightList
        availableFlights={{ outbound: [], return: [] }}
        selectedFlights={mockSelectedFlights}
        handleFlightSelection={mockHandleFlightSelection}
        searchData={mockSearchData}
      />
    );

    expect(screen.getByText('No flights available.')).toBeInTheDocument();
  });

  /**
   * @test Ensures that the selected flight is highlighted when clicked.
   */
  test('highlights the selected flight when clicked', () => {
    render(
      <FlightList
        availableFlights={mockAvailableFlights}
        selectedFlights={{ outbound: mockAvailableFlights.outbound[0], return: null }}
        handleFlightSelection={mockHandleFlightSelection}
        searchData={{ ...mockSearchData, isReturn: false }}
      />
    );

    // Find a button or other reliable element to locate the flight card
    const selectButton = screen.getByRole('button', { name: /select package|select flight/i });
    const flightCard = selectButton.closest('div.bg-gray-700');
    
    expect(flightCard).toHaveClass('bg-gray-700 p-4 rounded-lg mb-4 border-2 border-blue-500 cursor-pointer hover:border-blue-400 transition');
  });
});