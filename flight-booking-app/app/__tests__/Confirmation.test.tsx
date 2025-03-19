import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Confirmation from '../components/Confirmation';

describe('Confirmation Component', () => {
  const mockHandleNewSearch = jest.fn();
  const mockCalculateTotalPrice = jest.fn().mockReturnValue(5000);
  const mockPaymentDetails = {
    cardNumber: '1234567812345678',
    amount: 5000,
  };
  const mockSearchData = {
    origin: 'JFK',
    destination: 'LAX',
    departureDate: '2025-05-10',
    returnDate: '2025-05-20',
    cabinClass: 'Economy',
    passengers: 2,
  };
  const mockSelectedFlights = {
    outbound: {
      airline: 'Delta',
      flightNumber: 'DL123',
      departureTime: '10:00 AM',
      arrivalTime: '1:00 PM',
      duration: '3h',
      price: 2500,
    },
    return: {
      airline: 'Delta',
      flightNumber: 'DL456',
      departureTime: '3:00 PM',
      arrivalTime: '6:00 PM',
      duration: '3h',
      price: 2500,
    },
  };
  const mockPassengers = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Doe', email: 'jane@example.com' },
  ];
  const mockSelectedSeats = {
    outbound: ['12A', '12B'],
    return: ['14A', '14B'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * @test Ensures that the "Book Another Flight" button is rendered and functions correctly.
   */
  test('calls handleNewSearch when "Book Another Flight" button is clicked', () => {
    render(
      <Confirmation
        paymentDetails={mockPaymentDetails}
        selectedFlights={mockSelectedFlights}
        searchData={mockSearchData}
        passengers={mockPassengers}
        selectedSeats={mockSelectedSeats}
        calculateTotalPrice={mockCalculateTotalPrice}
        handleNewSearch={mockHandleNewSearch}
      />
    );

    const button = screen.getByRole('button', { name: /book another flight/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(mockHandleNewSearch).toHaveBeenCalledTimes(1);
  });

  /**
   * @test Verifies that the total price is calculated and displayed correctly.
   */
  test('displays the correct total price including taxes and fees', () => {
    render(
      <Confirmation
        paymentDetails={mockPaymentDetails}
        selectedFlights={mockSelectedFlights}
        searchData={mockSearchData}
        passengers={mockPassengers}
        selectedSeats={mockSelectedSeats}
        calculateTotalPrice={mockCalculateTotalPrice}
        handleNewSearch={mockHandleNewSearch}
      />
    );

    const totalPaid = screen.getByText(/total paid/i);
    expect(totalPaid).toBeInTheDocument();
    expect(screen.getByText('₹5,900')).toBeInTheDocument(); // ₹5000 + 18% tax
  });

  /**
   * @test Ensures that the component handles missing return flight gracefully.
   */
  test('renders correctly when there is no return flight', () => {
    render(
      <Confirmation
        paymentDetails={mockPaymentDetails}
        selectedFlights={{ outbound: mockSelectedFlights.outbound }}
        searchData={{ ...mockSearchData, isReturn: false }}
        passengers={mockPassengers}
        selectedSeats={{ outbound: mockSelectedSeats.outbound }}
        calculateTotalPrice={mockCalculateTotalPrice}
        handleNewSearch={mockHandleNewSearch}
      />
    );

    // Check that return flight details are not rendered
    expect(screen.queryByText('Return Flight')).not.toBeInTheDocument();
  });

  /**
   * @test Ensures that the component handles missing passenger details gracefully.
   */
  test('renders correctly when there are no passengers', () => {
    render(
      <Confirmation
        paymentDetails={mockPaymentDetails}
        selectedFlights={mockSelectedFlights}
        searchData={mockSearchData}
        passengers={[]}
        selectedSeats={mockSelectedSeats}
        calculateTotalPrice={mockCalculateTotalPrice}
        handleNewSearch={mockHandleNewSearch}
      />
    );

    // Check that passenger details are not rendered
    expect(screen.queryByText('Passenger 1')).not.toBeInTheDocument();
  });
});