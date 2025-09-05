import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Github, Chrome, ArrowRight, Sparkles, Check } from 'lucide-react';

const SignUpPage = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    setCurrentPage('signup');
  }, [setCurrentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    
    // Placeholder registration logic
    setTimeout(() => {
      console.log('Registration attempt:', formData);
      setIsLoading(false);
      // Redirect to profile page on successful registration
      navigate('/profile');
    }, 1500);
  };

  const handleSocialSignUp = (provider) => {
    console.log(`Sign up with ${provider}`);
    // Placeholder for social authentication
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/profile');
    }, 1000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getPasswordStrength = (password) => {
    if (password.length < 6) return { strength: 'weak', color: 'text-red-400' };
    if (password.length < 10) return { strength: 'medium', color: 'text-yellow-400' };
    return { strength: 'strong', color: 'text-green-400' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-neon-cyan/20 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-neon-purple/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-neon-pink/10 rounded-full blur-2xl animate-pulse" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple p-0.5">
                <div className="w-full h-full rounded-xl bg-dark-800 flex items-center justify-center">
                  <Sparkles size={28} className="text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-orbitron font-bold text-white mb-2">
              Join LearnForge
            </h1>
            <p className="text-gray-400">
              Create your account and start learning today
            </p>
          </motion.div>

          {/* Sign Up Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5" />
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan/30 focus:shadow-lg transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple focus:shadow-neon-purple/30 focus:shadow-lg transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-pink focus:shadow-neon-pink/30 focus:shadow-lg transition-all duration-300"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center interactive"
                  >
                    {showPassword ? (
                      <EyeOff size={20} className="text-gray-400 hover:text-neon-cyan transition-colors" />
                    ) : (
                      <Eye size={20} className="text-gray-400 hover:text-neon-cyan transition-colors" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-dark-700 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full transition-all duration-300 ${
                            passwordStrength.strength === 'weak' 
                              ? 'w-1/3 bg-red-400' 
                              : passwordStrength.strength === 'medium'
                              ? 'w-2/3 bg-yellow-400'
                              : 'w-full bg-green-400'
                          }`}
                        />
                      </div>
                      <span className={`text-xs ${passwordStrength.color} capitalize`}>
                        {passwordStrength.strength}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:shadow-neon-blue/30 focus:shadow-lg transition-all duration-300"
                    placeholder="Confirm your password"
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
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-4 h-4 rounded border border-white/20 bg-white/10 text-neon-purple focus:ring-neon-purple focus:ring-2 opacity-0 absolute"
                  />
                  <div
                    onClick={() => setAgreeToTerms(!agreeToTerms)}
                    className={`w-4 h-4 rounded border-2 cursor-pointer interactive transition-all duration-300 flex items-center justify-center ${
                      agreeToTerms
                        ? 'border-neon-purple bg-neon-purple shadow-neon-purple/30 shadow-sm'
                        : 'border-white/20 bg-white/10 hover:border-neon-purple/50'
                    }`}
                  >
                    {agreeToTerms && <Check size={12} className="text-white" />}
                  </div>
                </div>
                <label htmlFor="terms" className="text-sm text-gray-300 leading-5 cursor-pointer">
                  I agree to the{' '}
                  <Link to="#" className="text-neon-cyan hover:text-neon-purple transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="#" className="text-neon-cyan hover:text-neon-purple transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold rounded-xl btn-glow transition-all duration-300 flex items-center justify-center space-x-2 interactive disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-dark-900 text-gray-400">Or sign up with</span>
              </div>
            </div>

            {/* Social Sign Up Buttons */}
            <div className="space-y-3 relative z-10">
              <motion.button
                type="button"
                onClick={() => handleSocialSignUp('Google')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 interactive group"
              >
                <Chrome size={20} className="text-red-400 group-hover:scale-110 transition-transform" />
                <span>Continue with Google</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => handleSocialSignUp('GitHub')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 interactive group"
              >
                <Github size={20} className="text-white group-hover:scale-110 transition-transform" />
                <span>Continue with GitHub</span>
              </motion.button>
            </div>

            {/* Login Link */}
            <div className="mt-8 text-center relative z-10">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-neon-cyan hover:text-neon-purple transition-colors font-medium interactive"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;