import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend adresimiz
});

export default api;