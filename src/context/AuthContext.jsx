import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const saveUserData = async (userId, data) => {
    try {
      // Mevcut kullanıcı verilerini al
      const existingData = localStorage.getItem(`userData_${userId}`);
      const currentData = existingData ? JSON.parse(existingData) : {};

      // Yeni verileri mevcut verilerle birleştir
      const updatedData = { ...currentData, ...data };

      // Verileri localStorage'a kaydet
      localStorage.setItem(`userData_${userId}`, JSON.stringify(updatedData));

      // Başarılı olduğunu belirt
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  };

  const getUserData = async (userId) => {
    try {
      // Kullanıcı verilerini localStorage'dan al
      const data = localStorage.getItem(`userData_${userId}`);
      
      // Veri yoksa boş bir obje döndür
      if (!data) {
        return {
          notes: [],
          diaryEntries: [],
          photos: []
        };
      }

      // Verileri parse et ve döndür
      const parsedData = JSON.parse(data);
      return {
        notes: parsedData.notes || [],
        diaryEntries: parsedData.diaryEntries || [],
        photos: parsedData.photos || []
      };
    } catch (error) {
      console.error('Error getting user data:', error);
      return {
        notes: [],
        diaryEntries: [],
        photos: []
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Burada normalde bir API çağrısı yapılır
      // Şimdilik basit bir kayıt işlemi yapıyoruz
      if (name && email && password) {
        const userData = {
          uid: Date.now().toString(),
          email,
          name,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Yeni kullanıcı için boş veri yapısı oluştur
        await saveUserData(userData.uid, {
          notes: [],
          diaryEntries: [],
          photos: []
        });
        
        navigate('/');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      // Burada normalde bir API çağrısı yapılır
      // Şimdilik basit bir kontrol yapıyoruz
      if (email && password) {
        const userData = {
          uid: Date.now().toString(),
          email,
          name: email.split('@')[0],
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const value = {
    user,
    loading,
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