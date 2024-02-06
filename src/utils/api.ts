import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.API_TOKEN}`,
  },
});

export default api;
