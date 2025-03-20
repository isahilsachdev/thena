import React, { useState } from 'react';
import { processPayment } from '../api';
import { toast } from 'react-toastify';

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
  isReturn: boolean;
};

type PaymentProps = {
  setPaymentDetails: (details: unknown) => void;
  setCurrentView: (view: string) => void;
  calculateTotalPrice: () => number;
  searchData: SearchData;
  selectedFlights: SelectedFlights;
};

const Payment: React.FC<PaymentProps> = ({ searchData, selectedFlights, setPaymentDetails, setCurrentView, calculateTotalPrice }) => {
  const [cardType, setCardType] = useState<'credit' | 'debit'>('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpirationDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };
  

  const validateCardNumber = (number: string) => /^[0-9]{16}$/.test(number.replace(/\s/g, ''));
  const validateExpirationDate = (date: string) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(date);
  const validateCVV = (cvv: string) => /^[0-9]{3,4}$/.test(cvv);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCardNumber(cardNumber)) {
      setError('Invalid card number. Please enter a 16-digit card number.');
      return;
    }
    if (!validateExpirationDate(expirationDate)) {
      setError('Invalid expiration date. Please use MM/YY format.');
      return;
    }
    if (!validateCVV(cvv)) {
      setError('Invalid CVV. Please enter a 3 or 4-digit CVV.');
      return;
    }

    setError('');
    const paymentDetails = { cardNumber: cardNumber.replaceAll(" ", ""), amount: calculateTotalPrice(), flightId: searchData?.isReturn ? [selectedFlights.outbound?.id]: [selectedFlights.outbound?.id, selectedFlights.return?.id] };
    try {
      setPaymentDetails(paymentDetails);
      await processPayment(paymentDetails);
      setCurrentView('confirmation');
    } catch (error) {
      setError('Payment failed. Please try again.');
      toast.error('Payment failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-white">Payment Details</h2>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm mb-1 text-white">Card Type</label>
          <div className="flex gap-4 text-white">
            <label className="flex items-center">
              <input
                type="radio"
                name="cardType"
                value="credit"
                checked={cardType === 'credit'}
                onChange={() => setCardType('credit')}
                className="mr-2"
              />
              Credit Card
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="cardType"
                value="debit"
                checked={cardType === 'debit'}
                onChange={() => setCardType('debit')}
                className="mr-2"
              />
              Debit Card
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1 text-white">Card Number</label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            required
            className="p-2 rounded w-full border border-white bg-transparent text-white"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1 text-white">Expiration Date</label>
          <input
            type="text"
            placeholder="MM/YY"
            required
            className="p-2 rounded w-full border border-white bg-transparent text-white"
            value={expirationDate}
            onChange={(e) => setExpirationDate(formatExpirationDate(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1 text-white">CVV</label>
          <input
            type="password"
            maxLength={3}
            placeholder="•••"
            required
            className="p-2 rounded w-full border border-white bg-transparent text-white"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1 text-white">Amount</label>
          <input
            type="number"
            required
            className="p-2 rounded w-full border border-white bg-transparent text-white"
            value={calculateTotalPrice()}
            disabled
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className='flex gap-4'>
          <button
            type="button"
            onClick={() => setCurrentView("passengerDetails")}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition w-full text-white"
          >
            Pay Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
