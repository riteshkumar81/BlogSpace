// In Vite, environment variables are exposed on import.meta.env
// and must be prefixed with VITE_

const API_URL = import.meta.env.VITE_API_URL;

// Check if the API URL is defined
if (!API_URL) {
  console.error('VITE_API_URL is not defined in the environment variables.');
}

// Create a reusable fetch function that automatically attaches the token
const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('blogging_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle non-JSON responses (like empty responses)
  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    // Throw an error with the data from the response
    throw new Error(data.message || data || 'An error occurred');
  }

  return data;
};

export const get = (endpoint) => api(endpoint, { method: 'GET' });
export const post = (endpoint, data) => api(endpoint, { method: 'POST', body: JSON.stringify(data) });
export const put = (endpoint, data) => api(endpoint, { method: 'PUT', body: JSON.stringify(data) });
export const del = (endpoint) => api(endpoint, { method: 'DELETE' });

export default { get, post, put, del };