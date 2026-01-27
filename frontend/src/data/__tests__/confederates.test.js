import { getConfederatesStart } from '../confederates';

describe('confederates data', () => {
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getConfederatesStart', () => {
    it('fetches both female and male confederates data', async () => {
      const femaleData = [{ name: 'Female1' }];
      const maleData = [{ name: 'Male1' }];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(femaleData)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(maleData)
        });

      const result = await getConfederatesStart();

      expect(mockFetch).toHaveBeenCalledWith('/confederates/confederates_f.json');
      expect(mockFetch).toHaveBeenCalledWith('/confederates/confederates_m.json');
      expect(result).toEqual({ femaleData, maleData });
    });

    it('throws error when female fetch fails', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });

      await expect(getConfederatesStart()).rejects.toThrow('Failed to fetch confederates data.');
    });

    it('throws error when male fetch fails', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
        .mockResolvedValueOnce({ ok: false });

      await expect(getConfederatesStart()).rejects.toThrow('Failed to fetch confederates data.');
    });

    it('throws error when both fetches fail', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({ ok: false });

      await expect(getConfederatesStart()).rejects.toThrow('Failed to fetch confederates data.');
    });
  });
});
