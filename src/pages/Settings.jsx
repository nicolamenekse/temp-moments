import React from 'react';
import { useTheme, themes } from '../context/ThemeContext';
import '../styles/Settings.css';

const Settings = () => {
  const { currentTheme, changeTheme } = useTheme();

  return (
    <div className="settings-container">
      <h1>Ayarlar</h1>
      
      <div className="settings-section">
        <h2>Tema Seçimi</h2>
        <div className="theme-options">
          {Object.values(themes).map((theme) => (
            <div
              key={theme.name}
              className={`theme-option ${currentTheme.name === theme.name ? 'active' : ''}`}
              onClick={() => changeTheme(theme.name)}
            >
              <div className="theme-preview" style={{ backgroundColor: theme.colors.background }}>
                <div className="theme-color" style={{ backgroundColor: theme.colors.primary }}></div>
                <div className="theme-color" style={{ backgroundColor: theme.colors.secondary }}></div>
                <div className="theme-color" style={{ backgroundColor: theme.colors.surface }}></div>
              </div>
              <span className="theme-name">{theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h2>Mevcut Tema</h2>
        <div className="current-theme">
          <div className="theme-info">
            <div className="color-preview">
              <div className="color-item">
                <span>Ana Renk</span>
                <div className="color-box" style={{ backgroundColor: currentTheme.colors.primary }}></div>
                <span className="color-code">{currentTheme.colors.primary}</span>
              </div>
              <div className="color-item">
                <span>İkincil Renk</span>
                <div className="color-box" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
                <span className="color-code">{currentTheme.colors.secondary}</span>
              </div>
              <div className="color-item">
                <span>Arkaplan</span>
                <div className="color-box" style={{ backgroundColor: currentTheme.colors.background }}></div>
                <span className="color-code">{currentTheme.colors.background}</span>
              </div>
              <div className="color-item">
                <span>Yüzey</span>
                <div className="color-box" style={{ backgroundColor: currentTheme.colors.surface }}></div>
                <span className="color-code">{currentTheme.colors.surface}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 