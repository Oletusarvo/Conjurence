/**Combines the passed strings into a single string, joined by whitespace and trimmed. */
export const createClassName = (...classNames: string[]) => classNames.join(' ').trim();
