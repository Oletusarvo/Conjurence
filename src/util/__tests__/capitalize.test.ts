import { capitalize } from '../capitalize';

test('Capitalizes the first letter', () => {
  const str = 'malja';
  const result = capitalize(str);
  expect(result).toBe('Malja');
});
