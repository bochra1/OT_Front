import { createContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth, clearAuth } from '../redux/authSlice';
import apiClient from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if token is in localStorage on mount (prefer Redux storage)
    const storedToken = localStorage.getItem('reduxToken') || localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('reduxUser') || localStorage.getItem('user');

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);
      dispatch(setAuth({ user: parsedUser, token: storedToken }));
    }

    setLoading(false);
  }, [dispatch]);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { access_token, user: userData } = response.data;

      localStorage.setItem('authToken', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      dispatch(setAuth({ user: userData, token: access_token }));

      setToken(access_token);
      setUser(userData);

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('reduxToken');
    localStorage.removeItem('reduxUser');
    dispatch(clearAuth());
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
