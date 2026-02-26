import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('stepstyle_token');
        const saved = localStorage.getItem('stepstyle_user');
        if (token && saved) {
            setUser(JSON.parse(saved));
            API.get('/auth/me').then(res => {
                setUser(res.data);
                localStorage.setItem('stepstyle_user', JSON.stringify(res.data));
            }).catch(() => { logout(); });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        localStorage.setItem('stepstyle_token', data.token);
        localStorage.setItem('stepstyle_user', JSON.stringify(data.user));
        setUser(data.user);
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await API.post('/auth/register', { name, email, password });
        localStorage.setItem('stepstyle_token', data.token);
        localStorage.setItem('stepstyle_user', JSON.stringify(data.user));
        setUser(data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('stepstyle_token');
        localStorage.removeItem('stepstyle_user');
        setUser(null);
    };

    const updateUser = (updates) => {
        const updated = { ...user, ...updates };
        setUser(updated);
        localStorage.setItem('stepstyle_user', JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
