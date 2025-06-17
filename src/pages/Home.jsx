import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
  const { user, saveUserData, getUserData } = useAuth();
  const navigate = useNavigate();
  const [dailyTasks, setDailyTasks] = useState({});
  const [streak, setStreak] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState([]);

  const predefinedTasks = [
    { id: 'exercise', name: 'Egzersiz Yap', icon: '💪', points: 15 },
    { id: 'water', name: 'Su İç (8 bardak)', icon: '💧', points: 10 },
    { id: 'reading', name: 'Yazılım Çalış', icon: '📚', points: 25 },
    { id: 'meditation', name: 'Meditasyon', icon: '🧘‍♀️', points: 15 },
    { id: 'healthy_meal', name: 'Sağlıklı Beslen', icon: '🥗', points: 15 },
    { id: 'sleep', name: 'Erken Uyu', icon: '😴', points: 20 },
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDailyTasks();
  }, [user, navigate]);

  const loadDailyTasks = async () => {
    if (user) {
      const userData = await getUserData(user.uid);
      const today = new Date().toISOString().split('T')[0];
      
      if (userData && userData.dailyTasks) {
        setDailyTasks(userData.dailyTasks[today] || {});
        calculateStreak(userData.dailyTasks);
        calculateWeeklyProgress(userData.dailyTasks);
      }
    }
  };

  const calculateStreak = (allTasks) => {
    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const dayTasks = allTasks[dateStr] || {};
      const completedTasks = Object.values(dayTasks).filter(Boolean).length;
      
      if (completedTasks >= 3) { // En az 3 görev tamamlandıysa
        currentStreak++;
      } else if (i > 0) { // Bugün değilse ve tamamlanmadıysa streak bozulur
        break;
      }
    }
    
    setStreak(currentStreak);
  };

  const calculateWeeklyProgress = (allTasks) => {
    const progress = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const dayTasks = allTasks[dateStr] || {};
      const completedTasks = Object.values(dayTasks).filter(Boolean).length;
      const totalTasks = predefinedTasks.length;
      
      progress.push({
        date: dateStr,
        day: checkDate.toLocaleDateString('tr-TR', { weekday: 'short' }),
        completed: completedTasks,
        total: totalTasks,
        percentage: (completedTasks / totalTasks) * 100
      });
    }
    
    setWeeklyProgress(progress);
  };

  const toggleTask = async (taskId) => {
    const today = new Date().toISOString().split('T')[0];
    const newDailyTasks = {
      ...dailyTasks,
      [taskId]: !dailyTasks[taskId]
    };
    
    setDailyTasks(newDailyTasks);
    
    // Save to user data
    const userData = await getUserData(user.uid);
    const updatedUserData = {
      ...userData,
      dailyTasks: {
        ...userData.dailyTasks,
        [today]: newDailyTasks
      }
    };
    
    await saveUserData(user.uid, updatedUserData);
    
    // Recalculate streak and progress
    calculateStreak(updatedUserData.dailyTasks);
    calculateWeeklyProgress(updatedUserData.dailyTasks);
  };

  const getTotalPoints = () => {
    return predefinedTasks
      .filter(task => dailyTasks[task.id])
      .reduce((total, task) => total + task.points, 0);
  };

  const getCompletionPercentage = () => {
    const completed = Object.values(dailyTasks).filter(Boolean).length;
    return Math.round((completed / predefinedTasks.length) * 100);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Anılarımız</h1>
        <p>Değerli anılarınızı biriktirin, saklayın ve paylaşın</p>
      </header>

      {/* Daily Tasks Tracker */}
      <div className="daily-tracker-section">
        <div className="tracker-header">
          <h2>🎯 Günlük Görevlerim</h2>
          <div className="streak-badge">
            🔥 {streak} gün streak!
          </div>
        </div>
        
        <div className="progress-overview">
          <div className="today-progress">
            <div className="progress-circle">
              <svg viewBox="0 0 100 100" className="progress-ring">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e9ecef"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#6c5ce7"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - getCompletionPercentage() / 100)}`}
                  className="progress-circle-fill"
                />
              </svg>
              <div className="progress-text">
                <span className="percentage">{getCompletionPercentage()}%</span>
                <span className="label">Tamamlandı</span>
              </div>
            </div>
            <div className="points-display">
              <span className="points">{getTotalPoints()}</span>
              <span className="points-label">Puan</span>
            </div>
          </div>
          
          <div className="weekly-chart">
            <h3>Bu Hafta</h3>
            <div className="chart-bars">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="chart-bar">
                  <div 
                    className="bar-fill" 
                    style={{ height: `${day.percentage}%` }}
                  ></div>
                  <span className="bar-label">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="tasks-grid">
          {predefinedTasks.map((task) => (
            <div 
              key={task.id} 
              className={`task-card ${dailyTasks[task.id] ? 'completed' : ''}`}
              onClick={() => toggleTask(task.id)}
            >
              <div className="task-icon">{task.icon}</div>
              <div className="task-info">
                <h4>{task.name}</h4>
                <span className="task-points">+{task.points} puan</span>
              </div>
              <div className="task-checkbox">
                {dailyTasks[task.id] ? '✅' : '⭕'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="features-grid">
        <Link to="/diary" className="feature-card">
          <div className="feature-icon">📝</div>
          <h2>Günlük</h2>
          <p>Günlük düşüncelerinizi ve duygularınızı kaydedin</p>
        </Link>

        <Link to="/notes" className="feature-card">
          <div className="feature-icon">📔</div>
          <h2>Not Defteri</h2>
          <p>Önemli notlarınızı ve hatırlatmalarınızı yazın</p>
        </Link>

        <Link to="/photos" className="feature-card">
          <div className="feature-icon">📸</div>
          <h2>Fotoğraflar</h2>
          <p>Anılarınızı fotoğraflarla ölümsüzleştirin</p>
        </Link>

        <Link to="/memories" className="feature-card">
          <div className="feature-icon">💭</div>
          <h2>Anılar</h2>
          <p>Tüm anılarınızı tek bir yerde toplayın</p>
        </Link>
      </div>
    </div>
  );
};

export default Home; 