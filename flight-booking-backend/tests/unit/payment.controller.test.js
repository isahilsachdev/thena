const request = require('supertest');
const app = require('../../src/app');
const supabase = require('../../src/config/supabase');
const { v4: uuidv4 } = require('uuid');

// Mock UUID to return predictable values
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid')
}));

// Mock the auth middleware
jest.mock('../../src/middleware/auth.middleware', () => ({
  protect: (req, res, next) => {
    req.user = { 
      id: 'mock-user-id',
      user_metadata: {
        name: 'Test User'
      }
    };
    next();
  },
}));

// Mock Supabase
jest.mock('../../src/config/supabase');

describe('Payment Controller', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Set up the basic Supabase mock implementation
    supabase.from.mockImplementation((table) => {
      if (table === 'flights') {
        return {
          upsert: jest.fn().mockResolvedValue({
            data: [{ id: 'mock-flight-id' }],
            error: null
          })
        };
      } else if (table === 'payments') {
        return {
          insert: jest.fn().mockResolvedValue({
            data: [{ id: 1, amount: 100, cardnumber: '4242424242424242' }],
            error: null
          }),
          select: jest.fn().mockResolvedValue({
            data: [{ id: 1, amount: 100 }],
            error: null
          })
        };
      } else if (table === 'bookings') {
        return {
          insert: jest.fn().mockResolvedValue({
            data: [{ id: 1 }],
            error: null
          })
        };
      }
      
      return {
        select: jest.fn().mockResolvedValue({
          data: [],
          error: null
        })
      };
    });
  });

  describe('POST /payments', () => {
    it('should create a payment with valid data', async () => {
      const response = await request(app)
        .post('/api/payment')
        .send({
          amount: 100,
          cardNumber: '4242424242424242',
          flightId: ['1']
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Payment and bookings created successfully');
      expect(supabase.from).toHaveBeenCalledWith('flights');
      expect(supabase.from).toHaveBeenCalledWith('payments');
      expect(supabase.from).toHaveBeenCalledWith('bookings');
    });

    it('should return an error for missing required fields', async () => {
      const response = await request(app)
        .post('/api/payment')
        .send({
          amount: 100,
          // Missing cardNumber
          flightId: ['1']
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing required payment information');
    });
  });

  describe('GET /payments', () => {
    it('should retrieve all payments', async () => {
      const response = await request(app)
        .get('/api/payment');

      expect(response.status).toBe(200);
      expect(response.body.payments).toHaveLength(1);
      expect(supabase.from).toHaveBeenCalledWith('payments');
    });
  });
});