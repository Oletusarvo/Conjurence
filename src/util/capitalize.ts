/**Returns a string with its first letter capitalized. */
export const capitalize = (str: string) => [str.at(0).toUpperCase(), str.slice(1)].join('');
