import { getCurrentUser } from '../users';
import client from '../client';

jest.mock('../client');

describe('users API', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getCurrentUser', () => {
    it('calls client.get with /currentUser endpoint', async () => {
      const mockUser = { id: 1, name: 'Test User' };
      client.get.mockResolvedValueOnce(mockUser);

      const result = await getCurrentUser();

      expect(client.get).toHaveBeenCalledWith('/currentUser');
      expect(result).toEqual(mockUser);
    });

    it('propagates errors from client', async () => {
      const error = new Error('Network error');
      client.get.mockRejectedValueOnce(error);

      await expect(getCurrentUser()).rejects.toThrow('Network error');
    });
  });
});
