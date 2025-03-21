const request = require('supertest');
const app = require('../../src/app');
const supabase = require('../../src/config/supabase');

jest.mock('../../src/config/supabase');

describe('Auth Controller', () => {
  describe('POST /register', () => {
    it('should register a user with valid data', async () => {
      // Clear previous mocks
      jest.clearAllMocks();
      
      // Mock Supabase auth signUp
      supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 1, email: 'test@example.com' }, session: { access_token: 'token' } },
        error: null,
      });

      // Make sure to use the correct route path - check your routes file
      const response = await request(app)
        .post('/api/auth/register') // Updated path with /api prefix
        .send({ email: 'test@example.com', password: 'password', name: 'Test User' });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
    });

    it('should return an error for missing email', async () => {
      // Make sure to use the correct route path - check your routes file
      const response = await request(app)
        .post('/api/auth/register') // Updated path with /api prefix
        .send({ password: 'password', name: 'Test User' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password are required');
    });
  });
});