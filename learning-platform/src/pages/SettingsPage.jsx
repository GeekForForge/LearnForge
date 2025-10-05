import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, Eye, EyeOff, Save, Trash2, 
  Github, Chrome, Unlink, Bell, Shield, Globe, Upload,
  CheckCircle, AlertCircle, Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SettingsPage = ({ setCurrentPage }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_BASE_URL = 'http://localhost:8080/api';

  // Real user profile data from backend
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: ''
  });

  // Password change data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings (stored in localStorage for now)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    courseUpdates: true,
    achievements: true,
    marketing: false
  });

  useEffect(() => {
    setCurrentPage('settings');
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load real user data
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      });

      // Load notification preferences from localStorage
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    }
  }, [isAuthenticated, user, setCurrentPage]);

  const showMessage = (type, message) => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(message);
      setSuccess('');
      setTimeout(() => setError(''), 5000);
    }
  };

  // ✅ HANDLE PROFILE SAVE
  const handleProfileSave = async () => {
    setIsLoading(true);
    try {
      console.log('💾 Updating profile:', profileData);

      const response = await axios.put(
        `${API_BASE_URL}/users/${user.userId}`,
        profileData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('✅ Profile updated:', response.data);
      updateUser(response.data);
      showMessage('success', 'Profile updated successfully!');
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      showMessage('error', err.response?.data || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ HANDLE PASSWORD CHANGE
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters long!');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/${user.userId}/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('✅ Password changed');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('success', 'Password updated successfully!');
    } catch (err) {
      console.error('❌ Error changing password:', err);
      showMessage('error', err.response?.data || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ HANDLE DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you ABSOLUTELY sure? This action cannot be undone!')) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/users/${user.userId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      showMessage('success', 'Account deleted successfully');
      setTimeout(() => {
        logout();
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('❌ Error deleting account:', err);
      showMessage('error', 'Failed to delete account');
    }
  };

  // ✅ SAVE NOTIFICATION PREFERENCES
  const handleNotificationToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
    showMessage('success', 'Notification preferences saved');
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: User },
    // { id: 'security', label: 'Security', icon: Shield },
    // { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'accounts', label: 'Connected Accounts', icon: Globe },
  ];

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader className="w-12 h-12 text-neon-cyan animate-spin" />
      </div>
    );
  }

  return (
  <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-xl text-gray-300">
            Manage your account preferences and security settings
          </p>
        </motion.div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-3"
          >
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-green-400 font-medium">{success}</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3"
          >
            <AlertCircle size={20} className="text-red-400" />
            <span className="text-red-400 font-medium">{error}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-neon-cyan border border-neon-purple/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
              
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-orbitron font-bold text-white mb-6">
                    Profile Information
                  </h2>
                  
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="relative">
                      {user.avatarUrl ? (
                        <img 
                          src={user.avatarUrl} 
                          alt={user.name}
                          className="w-20 h-20 rounded-full border-2 border-neon-cyan"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan p-1">
                          <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center">
                            <span className="text-2xl font-orbitron font-bold text-white">
                              {user.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                      <p className="text-gray-400">{user.email}</p>
                      {user.provider && (
                        <p className="text-sm text-neon-cyan mt-1">
                          Connected via {user.provider}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-pink transition-all"
                        placeholder="Your location"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-all resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <motion.button
                    onClick={handleProfileSave}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-xl transition-all flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="animate-spin" size={18} />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </motion.button>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-orbitron font-bold text-white mb-6">
                    Security Settings
                  </h2>
                  
                  <div className="bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full pl-4 pr-12 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-all"
                          placeholder="Current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showCurrentPassword ? (
                            <EyeOff size={20} className="text-gray-400 hover:text-neon-cyan transition-colors" />
                          ) : (
                            <Eye size={20} className="text-gray-400 hover:text-neon-cyan transition-colors" />
                          )}
                        </button>
                      </div>
                      
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full pl-4 pr-12 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple transition-all"
                          placeholder="New password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNewPassword ? (
                            <EyeOff size={20} className="text-gray-400 hover:text-neon-cyan transition-colors" />
                          ) : (
                            <Eye size={20} className="text-gray-400 hover:text-neon-cyan transition-colors" />
                          )}
                        </button>
                      </div>
                      
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full pl-4 pr-12 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-pink transition-all"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} className="text-gray-400 hover:text-neon-cyan transition-colors" />
                          ) : (
                            <Eye size={20} className="text-gray-400 hover:text-neon-cyan transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={handlePasswordChange}
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-xl transition-all flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="animate-spin" size={18} />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Lock size={18} />
                          <span>Update Password</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
                    <p className="text-gray-400 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <motion.button
                      onClick={handleDeleteAccount}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all flex items-center space-x-2"
                    >
                      <Trash2 size={18} />
                      <span>Delete Account</span>
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-orbitron font-bold text-white mb-6">
                    Notification Preferences
                  </h2>
                  
                  <div className="space-y-4">
                    {Object.entries({
                      email: 'Email Notifications',
                      push: 'Push Notifications',
                      courseUpdates: 'Course Updates',
                      achievements: 'Achievement Alerts',
                      marketing: 'Marketing Communications'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                        <div>
                          <h4 className="font-medium text-white">{label}</h4>
                          <p className="text-sm text-gray-400 mt-1">
                            {key === 'email' && 'Receive notifications via email'}
                            {key === 'push' && 'Receive push notifications in your browser'}
                            {key === 'courseUpdates' && 'Get notified about new lessons and updates'}
                            {key === 'achievements' && 'Celebrate your learning milestones'}
                            {key === 'marketing' && 'Receive promotional content and offers'}
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleNotificationToggle(key)}
                          whileHover={{ scale: 1.05 }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications[key] ? 'bg-neon-cyan' : 'bg-gray-600'
                          }`}
                        >
                          <motion.span
                            animate={{ x: notifications[key] ? 20 : 2 }}
                            className="inline-block h-4 w-4 transform rounded-full bg-white transition"
                          />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Accounts */}
              {activeTab === 'accounts' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-orbitron font-bold text-white mb-6">
                    Connected Accounts
                  </h2>
                  
                  <div className="space-y-4">
                    {/* GitHub Account */}
                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                          <Github size={24} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">GitHub Account</h4>
                          <p className="text-sm text-gray-400">
                            {user.provider === 'github' ? `Connected as ${user.email}` : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      {user.provider === 'github' ? (
                        <span className="px-4 py-2 bg-green-500/20 text-green-400 font-medium rounded-lg border border-green-500/30">
                          Connected
                        </span>
                      ) : (
                        <motion.button
                          onClick={() => window.location.href = '/login'}
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-medium rounded-lg transition-all flex items-center space-x-2"
                        >
                          <Github size={16} />
                          <span>Connect</span>
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-2">Why connect accounts?</h3>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Sign in faster with social authentication</li>
                      <li>• Sync your coding projects and repositories</li>
                      <li>• Share your learning progress on social platforms</li>
                      <li>• Access additional features and integrations</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
