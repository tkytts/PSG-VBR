import client from '../client';

// Mock config
jest.mock('../../config', () => ({
  __esModule: true,
  default: { serverUrl: 'http://test-server' }
}));

describe('API client', () => {
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('request function', () => {
    it('makes GET request with correct URL and headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ data: 'test' })
      });

      const result = await client.get('/test-endpoint');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-server/test-endpoint',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    it('makes POST request with JSON body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ success: true })
      });

      const result = await client.post('/create', { name: 'test' });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-server/create',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'test' }),
          headers: { 'Content-Type': 'application/json' }
        })
      );
      expect(result).toEqual({ success: true });
    });

    it('makes PUT request with JSON body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ updated: true })
      });

      const result = await client.put('/update/1', { name: 'updated' });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-server/update/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'updated' }),
          headers: { 'Content-Type': 'application/json' }
        })
      );
      expect(result).toEqual({ updated: true });
    });

    it('makes DELETE request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ deleted: true })
      });

      const result = await client.delete('/delete/1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-server/delete/1',
        expect.objectContaining({
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
      );
      expect(result).toEqual({ deleted: true });
    });

    it('returns text response when content-type is not JSON', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: () => Promise.resolve('plain text response')
      });

      const result = await client.get('/text-endpoint');

      expect(result).toBe('plain text response');
    });

    it('handles missing content-type header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers(),
        text: () => Promise.resolve('no content type')
      });

      const result = await client.get('/no-content-type');

      expect(result).toBe('no content type');
    });

    it('throws error on non-ok response with error text', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: () => Promise.resolve('Resource not found')
      });

      await expect(client.get('/not-found')).rejects.toThrow(
        'HTTP 404 Not Found: Resource not found'
      );
    });

    it('throws error on non-ok response without error text', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('')
      });

      await expect(client.get('/server-error')).rejects.toThrow(
        'HTTP 500 Internal Server Error'
      );
    });

    it('handles text() rejection gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.reject(new Error('Failed to read body'))
      });

      await expect(client.get('/error')).rejects.toThrow(
        'HTTP 500 Internal Server Error'
      );
    });
  });
});
