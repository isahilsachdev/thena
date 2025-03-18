type Passenger = {
  name: string;
  email: string;
};

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

type SelectedSeats = {
  outbound: string[];
  return?: string[];
};

type PassengerDetailsProps = {
  passengers: Passenger[];
  handlePassengerChange: (index: number, field: "name" | "email", value: string) => void;
  selectedSeats: SelectedSeats;
  selectedFlights: SelectedFlights;
  setCurrentView: (view: string) => void;
  handleBookingConfirmation: (event: React.FormEvent) => void;
  calculateTotalPrice: () => number;
};

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

      <form onSubmit={handleBookingConfirmation} className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Enter Passenger Information</h3>

        {passengers.map((passenger, index) => (
          <div key={index} className="mb-6 p-4 bg-gray-700 rounded">
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
              {selectedFlights.return && (
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
            onClick={() => setCurrentView("payments")}
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