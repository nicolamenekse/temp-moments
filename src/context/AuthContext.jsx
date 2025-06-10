import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Kullanıcı verilerini yükle
      const userData = {
        ...foundUser,
        diary: JSON.parse(localStorage.getItem(`diary_${foundUser.id}`) || '[]'),
        notes: JSON.parse(localStorage.getItem(`notes_${foundUser.id}`) || '[]'),
        photos: JSON.parse(localStorage.getItem(`photos_${foundUser.id}`) || '[]')
      };
      setUser(userData);
      return { success: true };
    }
    return { success: false, error: 'E-posta veya şifre hatalı' };
  };

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'Bu e-posta adresi zaten kullanılıyor' };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Yeni kullanıcı için boş veri yapıları oluştur
    localStorage.setItem(`diary_${newUser.id}`, JSON.stringify([]));
    localStorage.setItem(`notes_${newUser.id}`, JSON.stringify([]));
    localStorage.setItem(`photos_${newUser.id}`, JSON.stringify([]));

    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const saveUserData = (dataType, data) => {
    if (user) {
      localStorage.setItem(`${dataType}_${user.id}`, JSON.stringify(data));
      setUser(prev => ({
        ...prev,
        [dataType]: data
      }));
    }
  };

  const getUserData = (dataType) => {
    if (user) {
      return JSON.parse(localStorage.getItem(`${dataType}_${user.id}`) || '[]');
    }
    return [];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout,
      saveUserData,
      getUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 