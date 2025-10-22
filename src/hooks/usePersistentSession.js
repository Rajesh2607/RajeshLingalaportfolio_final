import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import SECURITY_CONFIG from '../config/securityConfig';

/**
 * Custom hook for persistent session validation
 * Checks if the session has expired even after browser close/reopen
 * Runs on every page load/component mount
 */
export const usePersistentSessionCheck = () => {
  useEffect(() => {
    const checkPersistentSession = async () => {
      const user = auth.currentUser;
      
      // Only check if user is logged in
      if (!user) {
        // Clean up any old session data
        localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEYS.SESSION_START_TIME);
        localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEYS.LAST_ACTIVITY_TIME);
        return;
      }

      const sessionStartTime = localStorage.getItem(
        SECURITY_CONFIG.STORAGE_KEYS.SESSION_START_TIME
      );

      // If no session start time found, create one (new session)
      if (!sessionStartTime) {
        const now = Date.now();
        localStorage.setItem(
          SECURITY_CONFIG.STORAGE_KEYS.SESSION_START_TIME,
          now.toString()
        );
        localStorage.setItem(
          SECURITY_CONFIG.STORAGE_KEYS.LAST_ACTIVITY_TIME,
          now.toString()
        );
        console.log('🔐 New persistent session created:', new Date(now).toLocaleString());
        return;
      }

      // Check if absolute timeout (2 hours from initial login) has been exceeded
      const sessionStart = parseInt(sessionStartTime, 10);
      const now = Date.now();
      const sessionDuration = now - sessionStart;
      const absoluteTimeout = SECURITY_CONFIG.SESSION.ABSOLUTE_TIMEOUT;

      console.log('🔍 Session Check:', {
        sessionStart: new Date(sessionStart).toLocaleString(),
        currentTime: new Date(now).toLocaleString(),
        sessionDuration: Math.round(sessionDuration / 1000 / 60) + ' minutes',
        maxDuration: Math.round(absoluteTimeout / 1000 / 60) + ' minutes',
        expired: sessionDuration >= absoluteTimeout
      });

      if (sessionDuration >= absoluteTimeout) {
        console.log('❌ Session expired! Logging out...');
        
        // Session has expired
        try {
          // Clean up localStorage
          localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEYS.SESSION_START_TIME);
          localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEYS.LAST_ACTIVITY_TIME);
          
          // Set logout reason
          sessionStorage.setItem(
            SECURITY_CONFIG.STORAGE_KEYS.LOGOUT_REASON,
            SECURITY_CONFIG.LOGOUT_REASONS.ABSOLUTE_TIMEOUT
          );
          
          // Sign out
          await signOut(auth);
          console.log('✅ User logged out due to session expiry');
        } catch (error) {
          console.error('Error during session expiry logout:', error);
        }
      } else {
        // Update last activity time
        localStorage.setItem(
          SECURITY_CONFIG.STORAGE_KEYS.LAST_ACTIVITY_TIME,
          now.toString()
        );
        
        const remainingTime = absoluteTimeout - sessionDuration;
        console.log(`✅ Session valid. ${Math.round(remainingTime / 1000 / 60)} minutes remaining.`);
      }
    };

    // Check immediately on mount
    checkPersistentSession();

    // Also check every minute while component is mounted
    const interval = setInterval(checkPersistentSession, 60000); // Check every 1 minute

    return () => {
      clearInterval(interval);
    };
  }, []);
};

/**
 * Initialize session on login
 * Call this function right after successful login
 */
export const initializePersistentSession = () => {
  const now = Date.now();
  localStorage.setItem(
    SECURITY_CONFIG.STORAGE_KEYS.SESSION_START_TIME,
    now.toString()
  );
  localStorage.setItem(
    SECURITY_CONFIG.STORAGE_KEYS.LAST_ACTIVITY_TIME,
    now.toString()
  );
  console.log('🔐 Persistent session initialized:', new Date(now).toLocaleString());
};

/**
 * Clear session on logout
 * Call this function when user manually logs out
 */
export const clearPersistentSession = () => {
  localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEYS.SESSION_START_TIME);
  localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEYS.LAST_ACTIVITY_TIME);
  console.log('🗑️ Persistent session cleared');
};

/**
 * Get session info for display
 */
export const getSessionInfo = () => {
  const sessionStartTime = localStorage.getItem(
    SECURITY_CONFIG.STORAGE_KEYS.SESSION_START_TIME
  );
  
  if (!sessionStartTime) {
    return null;
  }

  const sessionStart = parseInt(sessionStartTime, 10);
  const now = Date.now();
  const sessionDuration = now - sessionStart;
  const absoluteTimeout = SECURITY_CONFIG.SESSION.ABSOLUTE_TIMEOUT;
  const remainingTime = Math.max(0, absoluteTimeout - sessionDuration);

  return {
    startTime: new Date(sessionStart),
    currentDuration: sessionDuration,
    remainingTime: remainingTime,
    isExpired: sessionDuration >= absoluteTimeout,
    formattedRemaining: formatTime(remainingTime)
  };
};

/**
 * Format milliseconds to readable time
 */
const formatTime = (ms) => {
  const totalMinutes = Math.floor(ms / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
