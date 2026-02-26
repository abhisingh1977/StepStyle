import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('stepstyle_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

API.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('stepstyle_token');
            localStorage.removeItem('stepstyle_user');
        }
        return Promise.reject(err);
    }
);

export default API;
