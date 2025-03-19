import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Payment from '../components/Payment';
import { processPayment } from '../api';

jest.mock('../api', () => ({
  processPayment: jest.fn()
}));

describe('Payment Component', () => {
  const mockSetPaymentDetails = jest.fn();
  const mockSetCurrentView = jest.fn();
  const mockCalculateTotalPrice = jest.fn().mockReturnValue(500);
  const mockSearchData = {
    origin: 'JFK',
    destination: 'LAX',
    departureDate: '2025-05-10',
    isReturn: false,
    cabinClass: 'Economy',
    passengers: 1,
  };
  const mockSelectedFlights = {
    outbound: { 
      airline: 'Delta', 
      flightNumber: 'DL123', 
      price: 500,
      id: 'flight123' // Adding id property to match the component's expectations
    },
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Using modern React Testing Library render
    render(
      <Payment
        searchData={mockSearchData}
        selectedFlights={mockSelectedFlights}
        setPaymentDetails={mockSetPaymentDetails}
        setCurrentView={mockSetCurrentView}
        calculateTotalPrice={mockCalculateTotalPrice}
      />
    );
  });

  test('renders the Payment component', () => {
    expect(screen.getByText('Payment Details')).toBeInTheDocument();
    expect(screen.getByText('Credit Card')).toBeInTheDocument();
    expect(screen.getByText('Debit Card')).toBeInTheDocument();
  });

  test('validates and formats card number', () => {
    const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
    fireEvent.change(cardInput, { target: { value: '1234567890123456' } });
    expect(cardInput.value).toBe('1234 5678 9012 3456');
  });

  test('validates and formats expiration date', () => {
    const expInput = screen.getByPlaceholderText('MM/YY');
    fireEvent.change(expInput, { target: { value: '1225' } });
    expect(expInput.value).toBe('12/25');
  });

  test('shows error message for invalid card number', async () => {
    // Submit without entering valid card data
    fireEvent.submit(screen.getByRole('button', { name: /pay now/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid card number/i)).toBeInTheDocument();
    });
  });

  test('submits valid payment details', async () => {
    // Mock successful payment
    processPayment.mockResolvedValueOnce({});
    
    // Fill out the form with valid data
    fireEvent.change(screen.getByPlaceholderText('1234 5678 9012 3456'), {
      target: { value: '1234 5678 9012 3456' },
    });
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/25' } });
    fireEvent.change(screen.getByPlaceholderText('•••'), { target: { value: '123' } });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /pay now/i }));
    
    // Check that the appropriate functions were called
    await waitFor(() => {
      expect(mockSetPaymentDetails).toHaveBeenCalledWith({
        cardNumber: '1234567890123456',
        amount: 500,
        flightId: ['flight123']
      });
      expect(processPayment).toHaveBeenCalled();
      expect(mockSetCurrentView).toHaveBeenCalledWith('confirmation');
    });
  });

  test('shows error message when payment fails', async () => {
    // Mock failed payment
    processPayment.mockRejectedValueOnce(new Error('Payment failed'));
    
    // Fill out the form with valid data
    fireEvent.change(screen.getByPlaceholderText('1234 5678 9012 3456'), {
      target: { value: '1234 5678 9012 3456' },
    });
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/25' } });
    fireEvent.change(screen.getByPlaceholderText('•••'), { target: { value: '123' } });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /pay now/i }));
    
    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
    });
  });
});