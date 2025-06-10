import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

// Form validation schemas
const registerSchema = yup.object().shape({
  name: yup.string().required('İsim zorunludur').min(2, 'İsim en az 2 karakter olmalıdır'),
  email: yup.string().email('Geçerli bir email adresi giriniz').required('Email zorunludur'),
  password: yup.string().required('Şifre zorunludur').min(6, 'Şifre en az 6 karakter olmalıdır')
});

const loginSchema = yup.object().shape({
  email: yup.string().email('Geçerli bir email adresi giriniz').required('Email zorunludur'),
  password: yup.string().required('Şifre zorunludur')
});

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const saveUserData = async (userId, data) => {
    try {
      if (!userId) throw new Error('User ID is required');
      
      const existingData = localStorage.getItem(`userData_${userId}`);
      const currentData = existingData ? JSON.parse(existingData) : {};
      const updatedData = { ...currentData, ...data };
      
      localStorage.setItem(`userData_${userId}`, JSON.stringify(updatedData));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      setError('Veri kaydedilirken bir hata oluştu');
      return false;
    }
  };

  const getUserData = async (userId) => {
    try {
      if (!userId) throw new Error('User ID is required');
      
      const data = localStorage.getItem(`userData_${userId}`);
      
      if (!data) {
        return {
          notes: [],
          diaryEntries: [],
          photos: []
        };
      }

      const parsedData = JSON.parse(data);
      return {
        notes: parsedData.notes || [],
        diaryEntries: parsedData.diaryEntries || [],
        photos: parsedData.photos || []
      };
    } catch (error) {
      console.error('Error getting user data:', error);
      setError('Veri alınırken bir hata oluştu');
      return {
        notes: [],
        diaryEntries: [],
        photos: []
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      
      // Validate input
      await registerSchema.validate({ name, email, password });
      
      // Check if email already exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      if (existingUsers.some(user => user.email === email)) {
        throw new Error('Bu email adresi zaten kullanımda');
      }

      const userData = {
        uid: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString()
      };

      // Save user to users list
      existingUsers.push(userData);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Initialize user data
      await saveUserData(userData.uid, {
        notes: [],
        diaryEntries: [],
        photos: []
      });
      
      navigate('/');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      
      // Validate input
      await loginSchema.validate({ email, password });
      
      // Check credentials
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    saveUserData,
    getUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 