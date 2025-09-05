import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, Eye, EyeOff, Save, LogOut, Trash2, 
  Moon, Sun, Github, Chrome, Unlink, Bell, Shield, 
  Globe, Smartphone, Download, Upload
} from 'lucide-react';

const SettingsPage = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // User profile data
  const [profileData, setProfileData] = useState({
    name: 'Alex Developer',
    email: 'alex@example.com',
    bio: 'Passionate developer learning new technologies',
    location: 'San Francisco, CA',
    website: 'https://alexdev.com'
  });

  // Password change data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Connected accounts
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: true,
    github: false
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    courseUpdates: true,
    achievements: true,
    marketing: false
  });

  useEffect(() => {
    setCurrentPage('settings');
  }, [setCurrentPage]);

  const handleProfileSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Profile updated:', profileData);
      setIsLoading(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      console.log('Password change requested');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsLoading(false);
      alert('Password updated successfully!');
    }, 1000);
  };

  const handleAccountDisconnect = (provider) => {
    setConnectedAccounts(prev => ({
      ...prev,
      [provider]: false
    }));
    console.log(`Disconnected ${provider} account`);
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} account disconnected`);
  };

  const handleAccountConnect = (provider) => {
    setConnectedAccounts(prev => ({
      ...prev,
      [provider]: true
    }));
    console.log(`Connected ${provider} account`);
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} account connected`);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
      alert('Account deletion requested. You will receive a confirmation email.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: isDarkMode ? Moon : Sun },
    { id: 'accounts', label: 'Connected Accounts', icon: Globe },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-xl text-gray-300">
            Manage your account preferences and security settings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 interactive ${
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
            transition={{ duration: 0.6, delay: 0.2 }}
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
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan p-1">
                        <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center">
                          <span className="text-2xl font-orbitron font-bold text-white">
                            {profileData.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-neon-cyan rounded-full flex items-center justify-center interactive hover:scale-110 transition-transform">
                        <Upload size={14} className="text-dark-900" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{profileData.name}</h3>
                      <p className="text-gray-400">{profileData.email}</p>
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
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan/30 focus:shadow-lg transition-all duration-300"
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
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple focus:shadow-neon-purple/30 focus:shadow-lg transition-all duration-300"
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
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-pink focus:shadow-neon-pink/30 focus:shadow-lg transition-all duration-300"
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
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:shadow-neon-blue/30 focus:shadow-lg transition-all duration-300"
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
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan/30 focus:shadow-lg transition-all duration-300 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <motion.button
                    onClick={handleProfileSave}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-xl btn-glow transition-all duration-300 flex items-center space-x-2 interactive disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                          className="w-full pl-4 pr-12 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan/30 focus:shadow-lg transition-all duration-300"
                          placeholder="Current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center interactive"
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
                          className="w-full pl-4 pr-12 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple focus:shadow-neon-purple/30 focus:shadow-lg transition-all duration-300"
                          placeholder="New password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center interactive"
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
                          className="w-full pl-4 pr-12 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-pink focus:shadow-neon-pink/30 focus:shadow-lg transition-all duration-300"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center interactive"
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
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-xl btn-glow transition-all duration-300 flex items-center space-x-2 interactive disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2 interactive"
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
                          onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                          whileHover={{ scale: 1.05 }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors interactive ${
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

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-orbitron font-bold text-white mb-6">
                    Appearance Settings
                  </h2>
                  
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Theme</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {isDarkMode ? <Moon size={20} className="text-neon-cyan" /> : <Sun size={20} className="text-yellow-400" />}
                          <span className="text-white font-medium">
                            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">
                          Currently using {isDarkMode ? 'dark' : 'light'} theme
                        </span>
                      </div>
                      <motion.button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        whileHover={{ scale: 1.05 }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors interactive ${
                          isDarkMode ? 'bg-neon-cyan' : 'bg-gray-600'
                        }`}
                      >
                        <motion.span
                          animate={{ x: isDarkMode ? 20 : 2 }}
                          className="inline-block h-4 w-4 transform rounded-full bg-white transition"
                        />
                      </motion.button>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Note: Light mode is coming soon! Currently, the platform uses the futuristic dark theme.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Color Scheme Preview</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-neon-purple shadow-neon-purple/50 shadow-lg"></div>
                        <span className="text-xs text-gray-400">Purple</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-neon-cyan shadow-neon-cyan/50 shadow-lg"></div>
                        <span className="text-xs text-gray-400">Cyan</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-neon-pink shadow-neon-pink/50 shadow-lg"></div>
                        <span className="text-xs text-gray-400">Pink</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-neon-blue shadow-neon-blue/50 shadow-lg"></div>
                        <span className="text-xs text-gray-400">Blue</span>
                      </div>
                    </div>
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
                    {/* Google Account */}
                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                          <Chrome size={24} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Google Account</h4>
                          <p className="text-sm text-gray-400">
                            {connectedAccounts.google ? 'Connected as alex@gmail.com' : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      {connectedAccounts.google ? (
                        <motion.button
                          onClick={() => handleAccountDisconnect('google')}
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all interactive flex items-center space-x-2"
                        >
                          <Unlink size={16} />
                          <span>Disconnect</span>
                        </motion.button>
                      ) : (
                        <motion.button
                          onClick={() => handleAccountConnect('google')}
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-medium rounded-lg transition-all interactive flex items-center space-x-2"
                        >
                          <Chrome size={16} />
                          <span>Connect</span>
                        </motion.button>
                      )}
                    </div>

                    {/* GitHub Account */}
                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                          <Github size={24} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">GitHub Account</h4>
                          <p className="text-sm text-gray-400">
                            {connectedAccounts.github ? 'Connected as alexdev' : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      {connectedAccounts.github ? (
                        <motion.button
                          onClick={() => handleAccountDisconnect('github')}
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all interactive flex items-center space-x-2"
                        >
                          <Unlink size={16} />
                          <span>Disconnect</span>
                        </motion.button>
                      ) : (
                        <motion.button
                          onClick={() => handleAccountConnect('github')}
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-medium rounded-lg transition-all interactive flex items-center space-x-2"
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