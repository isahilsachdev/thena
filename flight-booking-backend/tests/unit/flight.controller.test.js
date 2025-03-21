const request = require('supertest');
const app = require('../../src/app');
const supabase = require('../../src/config/supabase');

jest.mock('../../src/config/supabase');
jest.mock('../../src/middleware/auth.middleware', () => ({
  protect: (req, res, next) => {
    req.user = { id: 'mock-user-id' };
    next();
  },
}));

describe('Flight Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET /flights', () => {
    it('should retrieve flights with valid query parameters', async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: [{ id: 1, flight_number: 'AI101', origin: 'AMD', destination: 'AGX' }],
          error: null,
        }),
      });

      const response = await request(app)
        .get('/api/flights?origin=AMD&destination=AGX');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('POST /flights', () => {
    it('should create a flight with valid data', async () => {
      // Mock the select method that's chained after insert
      const selectMock = jest.fn().mockResolvedValue({
        data: [{ id: 1, flight_number: 'AI101', origin: 'AMD', destination: 'AGX' }],
        error: null,
      });
      
      // Mock the insert method that returns an object with select
      const insertMock = jest.fn().mockReturnValue({
        select: selectMock
      });
      
      // Mock the from method
      supabase.from.mockReturnValue({
        insert: insertMock
      });

      const response = await request(app)
        .post('/api/flights')
        .send({
          flight_number: 'AI101',
          origin: 'AMD',
          destination: 'AGX',
          departure_date: new Date().toISOString(),
          arrival_date: new Date().toISOString(),
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
    });

    it('should return an error for missing required fields', async () => {
      const response = await request(app)
        .post('/api/flights')
        .send({
          origin: 'AMD',
          destination: 'AGX',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing required flight information');
    });
  });
});