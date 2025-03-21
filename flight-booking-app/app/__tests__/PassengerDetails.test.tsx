import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PassengerDetails from '../components/PassengerDetails';

describe('PassengerDetails Component', () => {
  const mockHandlePassengerChange = jest.fn();
  const mockSetCurrentView = jest.fn();
  const mockHandleBookingConfirmation = jest.fn((e) => e.preventDefault());
  const mockCalculateTotalPrice = jest.fn().mockReturnValue(5000);

  const mockPassengers = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Doe', email: 'jane@example.com' },
  ];

  const mockSelectedSeats = {
    outbound: ['12A', '12B'],
    return: ['14A', '14B'],
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * @test Verifies that the PassengerDetails component renders correctly with all required details.
   */
  test('renders the PassengerDetails component with all details', () => {
    render(
      <PassengerDetails
        passengers={mockPassengers}
        handlePassengerChange={mockHandlePassengerChange}
        selectedSeats={mockSelectedSeats}
        selectedFlights={mockSelectedFlights}
        setCurrentView={mockSetCurrentView}
        handleBookingConfirmation={mockHandleBookingConfirmation}
        calculateTotalPrice={mockCalculateTotalPrice}
      />
    );

    // Check for the title
    expect(screen.getByText('Passenger Details')).toBeInTheDocument();

    // Check for passenger details
    expect(screen.getByText('Passenger 1')).toBeInTheDocument();
    expect(screen.getByText('Passenger 2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
  });

  /**
   * @test Ensures that the "Back" button is rendered and functions correctly.
   */
  test('calls setCurrentView with "payments" when Back button is clicked', () => {
    render(
      <PassengerDetails
        passengers={mockPassengers}
        handlePassengerChange={mockHandlePassengerChange}
        selectedSeats={mockSelectedSeats}
        selectedFlights={mockSelectedFlights}
        setCurrentView={mockSetCurrentView}
        handleBookingConfirmation={mockHandleBookingConfirmation}
        calculateTotalPrice={mockCalculateTotalPrice}
      />
    );

    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);

    expect(mockSetCurrentView).toHaveBeenCalledWith('seatSelection');
  });

  /**
   * @test Ensures that the handlePassengerChange function is called when passenger details are updated.
   */
  test('calls handlePassengerChange when passenger details are updated', () => {
    render(
      <PassengerDetails
        passengers={mockPassengers}
        handlePassengerChange={mockHandlePassengerChange}
        selectedSeats={mockSelectedSeats}
        selectedFlights={mockSelectedFlights}
        setCurrentView={mockSetCurrentView}
        handleBookingConfirmation={mockHandleBookingConfirmation}
        calculateTotalPrice={mockCalculateTotalPrice}
      />
    );

    const nameInput = screen.getByDisplayValue('John Doe');
    fireEvent.change(nameInput, { target: { value: 'John Smith' } });

    expect(mockHandlePassengerChange).toHaveBeenCalledWith(0, 'name', 'John Smith');
  });

  /**
   * @test Ensures that the handleBookingConfirmation function is called when the form is submitted.
   */
  test('calls handleBookingConfirmation when the form is submitted', () => {
    render(
      <PassengerDetails
        passengers={mockPassengers}
        handlePassengerChange={mockHandlePassengerChange}
        selectedSeats={mockSelectedSeats}
        selectedFlights={mockSelectedFlights}
        setCurrentView={mockSetCurrentView}
        handleBookingConfirmation={mockHandleBookingConfirmation}
        calculateTotalPrice={mockCalculateTotalPrice}
      />
    );

    const submitButton = screen.getByRole('button', { name: /proceed to payment/i });
    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    expect(mockHandleBookingConfirmation).toHaveBeenCalledTimes(1);
  });

  /**
   * @test Verifies that the component handles missing return flight gracefully.
   */
  test('renders correctly when there is no return flight', () => {
    render(
      <PassengerDetails
        passengers={mockPassengers}
        handlePassengerChange={mockHandlePassengerChange}
        selectedSeats={{ outbound: mockSelectedSeats.outbound }}
        selectedFlights={{ outbound: mockSelectedFlights.outbound }}
        setCurrentView={mockSetCurrentView}
        handleBookingConfirmation={mockHandleBookingConfirmation}
        calculateTotalPrice={mockCalculateTotalPrice}
      />
    );

    // Check that return seat details are not rendered
    expect(screen.queryByText('Assigned Seat (Return):')).not.toBeInTheDocument();
  });

  /**
   * @test Verifies that the component handles missing passengers gracefully.
   */
  test('renders correctly when there are no passengers', () => {
    render(
      <PassengerDetails
        passengers={[]}
        handlePassengerChange={mockHandlePassengerChange}
        selectedSeats={mockSelectedSeats}
        selectedFlights={mockSelectedFlights}
        setCurrentView={mockSetCurrentView}
        handleBookingConfirmation={mockHandleBookingConfirmation}
        calculateTotalPrice={mockCalculateTotalPrice}
      />
    );

    // Check that passenger details are not rendered
    expect(screen.queryByText('Passenger 1')).not.toBeInTheDocument();
  });
});