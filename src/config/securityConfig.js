/**
 * Security Configuration for Admin Panel
 * 
 * This file contains all security-related settings for the admin panel.
 * Adjust these values according to your security requirements.
 */

export const SECURITY_CONFIG = {
  // Session Timeout Settings
  SESSION: {
    // Inactivity timeout (time without any user activity)
    // Default: 15 minutes (in milliseconds)
    // Set to 0 to disable inactivity logout (only use absolute timeout)
    INACTIVITY_TIMEOUT: 0, // Disabled - only absolute timeout active
    
    // Absolute session timeout (maximum session duration regardless of activity)
    // Default: 2 hours (in milliseconds)
    ABSOLUTE_TIMEOUT: 2 * 60 * 60 * 1000,
    
    // Warning time before logout - DISABLED (no warnings shown)
    WARNING_TIME: 0,
    
    // Activity throttle delay (minimum time between activity resets)
    // Default: 1 second (in milliseconds)
    ACTIVITY_THROTTLE: 1000,
  },

  // Activity Events to Track
  ACTIVITY_EVENTS: [
    'mousedown',
    'keydown',
    'scroll',
    'touchstart',
    'mousemove'
  ],

  // Password Requirements
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: false,
  },

  // Login Attempt Limits
  LOGIN: {
    // Maximum failed login attempts before temporary lockout
    MAX_ATTEMPTS: 5,
    
    // Lockout duration after max attempts (in milliseconds)
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    
    // Enable rate limiting
    RATE_LIMITING: true,
  },

  // Session Storage Keys
  STORAGE_KEYS: {
    LOGOUT_REASON: 'logoutReason',
    LOGIN_ATTEMPTS: 'loginAttempts',
    LOCKOUT_UNTIL: 'lockoutUntil',
    SESSION_START: 'sessionStart',
    SESSION_START_TIME: 'admin_session_start_time', // Persists across browser close
    LAST_ACTIVITY_TIME: 'admin_last_activity_time', // Persists across browser close
  },

  // Logout Reasons
  LOGOUT_REASONS: {
    INACTIVITY: 'inactivity',
    ABSOLUTE_TIMEOUT: 'absolute-timeout',
    MANUAL: 'manual',
    SECURITY: 'security',
  },

  // Logout Messages
  LOGOUT_MESSAGES: {
    inactivity: '⏱️ You were logged out due to inactivity for security reasons.',
    'absolute-timeout': '🔒 Your session has expired. Please login again.',
    manual: '👋 You have been logged out successfully.',
    security: '🛡️ You were logged out due to a security concern.',
  },
};

/**
 * Get a human-readable time string
 * @param {number} milliseconds 
 * @returns {string}
 */
export const getReadableTime = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
};

/**
 * Validate password strength
 * @param {string} password 
 * @returns {object}
 */
export const validatePassword = (password) => {
  const config = SECURITY_CONFIG.PASSWORD;
  const errors = [];

  if (password.length < config.MIN_LENGTH) {
    errors.push(`Password must be at least ${config.MIN_LENGTH} characters`);
  }

  if (config.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (config.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (config.REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (config.REQUIRE_SPECIAL_CHAR && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default SECURITY_CONFIG;
