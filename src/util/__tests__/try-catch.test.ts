import { tryCatch } from '../try-catch';

describe('testing the tryCatch function', () => {
  it('populates the return array correctly on success', async () => {
    const fn = jest.fn(() => {
      return true;
    });

    const [res, error] = await tryCatch(async () => fn());
    expect(error).toBe(null);
    expect(res).toBe(true);
  });

  it('populates the return array correctly on failure', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('error'));
    const [res, error] = await tryCatch(async () => fn());
    expect(res).toBe(null);
    expect(error).toBe('error');
  });
});
