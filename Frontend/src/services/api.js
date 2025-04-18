import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5432/api';

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
};

export const getUserData = async () => {
    const response = await axios.get(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return response.data;
};