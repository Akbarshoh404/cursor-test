import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navigation from '../layout/Navigation';
import apiService from '../../services/api';
import './Settings.css';

const Settings = () => {
  const { currentUser, updateProfile } = useAuth();
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      reminders: true,
      progress: true
    },
    privacy: {
      showProfile: true,
      showProgress: false,
      allowAnalytics: true
    },
    study: {
      dailyGoal: 30,
      reminderTime: '18:00',
      targetBand: 7.0,
      preferredSections: ['listening', 'reading', 'writing', 'speaking']
    }
  });
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    targetExam: 'ielts',
    studyLevel: 'intermediate'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Load user profile and settings
      if (currentUser) {
        setProfile({
          name: currentUser.name || '',
          email: currentUser.email || '',
          targetExam: currentUser.targetExam || 'ielts',
          studyLevel: currentUser.studyLevel || 'intermediate'
        });

        // Parse user settings if available
        if (currentUser.settings) {
          const userSettings = typeof currentUser.settings === 'string' 
            ? JSON.parse(currentUser.settings) 
            : currentUser.settings;
          
          setSettings(prev => ({
            ...prev,
            ...userSettings
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleProfileChange = (key, value) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleThemeChange = (theme) => {
    setSettings(prev => ({ ...prev, theme }));
    
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  const handleLanguageChange = (language) => {
    setSettings(prev => ({ ...prev, language }));
    // In a real app, you would implement i18n here
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage('');

      // Update profile
      const profileResponse = await updateProfile({
        name: profile.name,
        targetExam: profile.targetExam,
        studyLevel: profile.studyLevel,
        settings: JSON.stringify(settings)
      });

      if (profileResponse.success) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings({
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        reminders: true,
        progress: true
      },
      privacy: {
        showProfile: true,
        showProgress: false,
        allowAnalytics: true
      },
      study: {
        dailyGoal: 30,
        reminderTime: '18:00',
        targetBand: 7.0,
        preferredSections: ['listening', 'reading', 'writing', 'speaking']
      }
    });
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  };

  if (loading) {
    return (
      <div className="settings-page">
        <Navigation />
        <div className="settings-container">
          <div className="loading-spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <Navigation />
      
      <div className="settings-container animate-fade-in">
        <div className="settings-header">
          <h1>⚙️ Settings</h1>
          <p>Customize your PrepX experience</p>
        </div>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="settings-content">
          {/* Profile Section */}
          <div className="settings-section">
            <div className="section-header">
              <h2>👤 Profile</h2>
              <p>Update your personal information</p>
            </div>
            
            <div className="settings-grid">
              <div className="setting-item">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="setting-input"
                />
              </div>

              <div className="setting-item">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="setting-input disabled"
                />
                <small>Email cannot be changed</small>
              </div>

              <div className="setting-item">
                <label htmlFor="targetExam">Target Exam</label>
                <select
                  id="targetExam"
                  value={profile.targetExam}
                  onChange={(e) => handleProfileChange('targetExam', e.target.value)}
                  className="setting-select"
                >
                  <option value="ielts">IELTS</option>
                  <option value="toefl">TOEFL (Coming Soon)</option>
                  <option value="cefr">CEFR (Coming Soon)</option>
                  <option value="sat">SAT (Coming Soon)</option>
                </select>
              </div>

              <div className="setting-item">
                <label htmlFor="studyLevel">Study Level</label>
                <select
                  id="studyLevel"
                  value={profile.studyLevel}
                  onChange={(e) => handleProfileChange('studyLevel', e.target.value)}
                  className="setting-select"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="settings-section">
            <div className="section-header">
              <h2>🎨 Appearance</h2>
              <p>Customize the look and feel</p>
            </div>
            
            <div className="settings-grid">
              <div className="setting-item">
                <label>Theme</label>
                <div className="theme-selector">
                  <button
                    className={`theme-option ${settings.theme === 'light' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <div className="theme-preview light">
                      <div className="preview-header"></div>
                      <div className="preview-content"></div>
                    </div>
                    <span>Light</span>
                  </button>
                  
                  <button
                    className={`theme-option ${settings.theme === 'dark' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <div className="theme-preview dark">
                      <div className="preview-header"></div>
                      <div className="preview-content"></div>
                    </div>
                    <span>Dark</span>
                  </button>
                  
                  <button
                    className={`theme-option ${settings.theme === 'auto' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('auto')}
                  >
                    <div className="theme-preview auto">
                      <div className="preview-header"></div>
                      <div className="preview-content"></div>
                    </div>
                    <span>Auto</span>
                  </button>
                </div>
              </div>

              <div className="setting-item">
                <label htmlFor="language">Language</label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="setting-select"
                >
                  <option value="en">English</option>
                  <option value="uz">Uzbek (Coming Soon)</option>
                  <option value="ru">Russian (Coming Soon)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Study Preferences */}
          <div className="settings-section">
            <div className="section-header">
              <h2>📚 Study Preferences</h2>
              <p>Configure your study settings</p>
            </div>
            
            <div className="settings-grid">
              <div className="setting-item">
                <label htmlFor="dailyGoal">Daily Study Goal (minutes)</label>
                <input
                  id="dailyGoal"
                  type="range"
                  min="15"
                  max="180"
                  step="15"
                  value={settings.study.dailyGoal}
                  onChange={(e) => handleSettingsChange('study', 'dailyGoal', parseInt(e.target.value))}
                  className="setting-range"
                />
                <div className="range-value">{settings.study.dailyGoal} minutes</div>
              </div>

              <div className="setting-item">
                <label htmlFor="targetBand">Target Band Score</label>
                <input
                  id="targetBand"
                  type="range"
                  min="5.0"
                  max="9.0"
                  step="0.5"
                  value={settings.study.targetBand}
                  onChange={(e) => handleSettingsChange('study', 'targetBand', parseFloat(e.target.value))}
                  className="setting-range"
                />
                <div className="range-value">Band {settings.study.targetBand}</div>
              </div>

              <div className="setting-item">
                <label htmlFor="reminderTime">Daily Reminder Time</label>
                <input
                  id="reminderTime"
                  type="time"
                  value={settings.study.reminderTime}
                  onChange={(e) => handleSettingsChange('study', 'reminderTime', e.target.value)}
                  className="setting-input"
                />
              </div>

              <div className="setting-item">
                <label>Focus Areas</label>
                <div className="checkbox-group">
                  {['listening', 'reading', 'writing', 'speaking'].map(section => (
                    <label key={section} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.study.preferredSections.includes(section)}
                        onChange={(e) => {
                          const sections = e.target.checked
                            ? [...settings.study.preferredSections, section]
                            : settings.study.preferredSections.filter(s => s !== section);
                          handleSettingsChange('study', 'preferredSections', sections);
                        }}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom"></span>
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="settings-section">
            <div className="section-header">
              <h2>🔔 Notifications</h2>
              <p>Control what notifications you receive</p>
            </div>
            
            <div className="settings-grid">
              <div className="setting-item">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingsChange('notifications', 'email', e.target.checked)}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">Email Notifications</span>
                </label>
                <small>Receive updates and progress reports via email</small>
              </div>

              <div className="setting-item">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingsChange('notifications', 'push', e.target.checked)}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">Push Notifications</span>
                </label>
                <small>Get notified about new features and updates</small>
              </div>

              <div className="setting-item">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.reminders}
                    onChange={(e) => handleSettingsChange('notifications', 'reminders', e.target.checked)}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">Study Reminders</span>
                </label>
                <small>Daily reminders to help you stay on track</small>
              </div>

              <div className="setting-item">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.progress}
                    onChange={(e) => handleSettingsChange('notifications', 'progress', e.target.checked)}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">Progress Updates</span>
                </label>
                <small>Weekly progress summaries and achievements</small>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="settings-section">
            <div className="section-header">
              <h2>🔒 Privacy</h2>
              <p>Control your privacy and data settings</p>
            </div>
            
            <div className="settings-grid">
              <div className="setting-item">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={settings.privacy.showProfile}
                    onChange={(e) => handleSettingsChange('privacy', 'showProfile', e.target.checked)}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">Public Profile</span>
                </label>
                <small>Allow others to see your profile information</small>
              </div>

              <div className="setting-item">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={settings.privacy.showProgress}
                    onChange={(e) => handleSettingsChange('privacy', 'showProgress', e.target.checked)}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">Share Progress</span>
                </label>
                <small>Show your progress on leaderboards</small>
              </div>

              <div className="setting-item">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={settings.privacy.allowAnalytics}
                    onChange={(e) => handleSettingsChange('privacy', 'allowAnalytics', e.target.checked)}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">Analytics</span>
                </label>
                <small>Help improve PrepX by sharing anonymous usage data</small>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button
            onClick={resetSettings}
            className="btn btn-secondary"
            disabled={saving}
          >
            Reset to Defaults
          </button>
          <button
            onClick={saveSettings}
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;