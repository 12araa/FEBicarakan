export const useApiFetch = async (endpoint, options = {}) => {
  const config = useRuntimeConfig();

  const customHeaders = {
    'ngrok-skip-browser-warning': 'true',
    'Accept': 'application/json',
    ...options.headers, 
  };

  if (import.meta.client) {
    const userData = localStorage.getItem('app_user');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.token) {
        customHeaders['Authorization'] = `Bearer ${parsed.token}`;
      }
    }
  }

  return $fetch(endpoint, {
    baseURL: config.public.apiBase,
    ...options,
    headers: customHeaders,
  });
};