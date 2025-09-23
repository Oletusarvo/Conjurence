const env = process.env.NODE_ENV;
export const networkConfig = {
  api: env === 'development' ? '/api' : 'https://conjurence.onrender.com/api',
};
