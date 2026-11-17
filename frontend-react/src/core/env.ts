export const environment = {
  production: import.meta.env.PROD,
  apiUrl: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/backend_php' : 'http://localhost:8000'),
};
