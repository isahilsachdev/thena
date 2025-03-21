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

describe('Booking Controller', () => {
  describe('DELETE /bookings/:bookingId', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should cancel a booking with a valid booking ID', async () => {
      // Mock for successful booking retrieval
      const singleMock = jest.fn().mockResolvedValue({
        data: { id: 1, flight_id: 1, user_id: 'mock-user-id' },
        error: null
      });
      
      const eqMock = jest.fn().mockReturnValue({
        single: singleMock
      });
      
      const selectMock = jest.fn().mockReturnValue({
        eq: eqMock
      });
      
      // Mock for successful booking deletion
      const deleteEqMock = jest.fn().mockResolvedValue({
        data: {},
        error: null
      });
      
      const deleteMock = jest.fn().mockReturnValue({
        eq: deleteEqMock
      });
      
      // Set up the main from mock with both chains
      supabase.from = jest.fn().mockImplementation((table) => {
        return {
          select: selectMock,
          delete: deleteMock
        };
      });

      const response = await request(app)
        .delete('/api/bookings/1')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Booking deleted successfully');
    });

    it('should return an error for missing authorization token', async () => {
      const response = await request(app)
        .delete('/api/bookings/1');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authorization token is missing');
    });

    it('should return an error for invalid booking ID', async () => {
      // Mock for booking not found
      const singleMock = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Booking not found' }
      });
      
      const eqMock = jest.fn().mockReturnValue({
        single: singleMock
      });
      
      const selectMock = jest.fn().mockReturnValue({
        eq: eqMock
      });
      
      supabase.from = jest.fn().mockReturnValue({
        select: selectMock
      });

      const response = await request(app)
        .delete('/api/bookings/999')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Booking not found');
    });
  });
});