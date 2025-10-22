# 🔐 Admin Panel Security Features

This document outlines the security features implemented in the portfolio admin panel to protect against unauthorized access and ensure secure session management.

## 🛡️ Security Features Overview

### 1. **Session Timeout Management**
- **Inactivity Timeout**: Automatically logs out users after 15 minutes of inactivity
- **Absolute Timeout**: Maximum session duration of 2 hours regardless of activity
- **Warning System**: Shows a countdown warning 2 minutes before auto-logout
- **Activity Tracking**: Monitors user interactions (mouse, keyboard, scroll, touch)

### 2. **Session Status Indicators**
- **Secure Session Badge**: Visual indicator showing active secure session
- **Real-time Status**: Shows session health in the admin dashboard header
- **Logout Button**: Quick access logout with visual feedback

### 3. **Auto-Logout Reasons**
The system tracks different logout scenarios:
- `inactivity` - User was inactive for too long
- `absolute-timeout` - Maximum session duration reached
- `manual` - User manually logged out
- `security` - Security-related forced logout

### 4. **Session Warning Modal**
When a session is about to expire, users see:
- ⏰ Countdown timer showing time remaining
- 🛡️ Security notice explaining the timeout
- ✅ "Stay Logged In" button to extend the session
- 🚪 "Logout Now" button for immediate logout

## ⚙️ Configuration

All security settings can be adjusted in `/src/config/securityConfig.js`:

```javascript
export const SECURITY_CONFIG = {
  SESSION: {
    INACTIVITY_TIMEOUT: 15 * 60 * 1000,  // 15 minutes
    ABSOLUTE_TIMEOUT: 2 * 60 * 60 * 1000, // 2 hours
    WARNING_TIME: 2 * 60 * 1000,          // 2 minutes
    ACTIVITY_THROTTLE: 1000,              // 1 second
  },
  // ... more settings
}
```

### Adjusting Timeout Values

To change timeout durations, edit the values in `securityConfig.js`:

```javascript
// Example: Change to 30 minutes inactivity timeout
INACTIVITY_TIMEOUT: 30 * 60 * 1000,

// Example: Change to 4 hours absolute timeout
ABSOLUTE_TIMEOUT: 4 * 60 * 60 * 1000,

// Example: Show warning 5 minutes before logout
WARNING_TIME: 5 * 60 * 1000,
```

## 📁 File Structure

```
src/
├── config/
│   └── securityConfig.js          # Central security configuration
├── hooks/
│   └── useSessionTimeout.js       # Session timeout logic hook
├── components/
│   └── SessionTimeoutWarning.jsx  # Warning modal component
└── pages/
    └── admin/
        ├── AdminLogin.jsx         # Enhanced login with logout messages
        └── AdminDashboard.jsx     # Dashboard with session management
```

## 🔧 How It Works

### Session Tracking
1. **Session Start**: Timer begins when user logs in
2. **Activity Monitoring**: User actions reset the inactivity timer
3. **Warning Phase**: Modal appears before timeout
4. **Auto-Logout**: User is logged out if no action taken

### Activity Events Tracked
- Mouse movements and clicks
- Keyboard input
- Page scrolling
- Touch interactions (mobile)

### Throttling
Activity events are throttled to 1 event per second to avoid excessive timer resets and improve performance.

## 🎨 User Experience

### Login Page
- Shows logout reason (if applicable)
- Beautiful gradient animations
- Clear error messages
- Security notices

### Dashboard
- Session status indicator in header
- Non-intrusive background monitoring
- Warning modal with countdown
- Easy session extension

### Warning Modal
- Eye-catching design with animations
- Clear countdown display
- Two-button choice system
- Backdrop blur for focus

## 🔒 Security Best Practices

This implementation follows security best practices:

1. ✅ **Automatic session expiration** - Prevents unauthorized access
2. ✅ **User warning before logout** - Good UX while maintaining security
3. ✅ **Activity-based timeout** - Only active sessions stay alive
4. ✅ **Absolute maximum timeout** - Cannot be bypassed by activity
5. ✅ **Throttled activity tracking** - Prevents performance issues
6. ✅ **Clean session cleanup** - Proper timer cleanup on unmount
7. ✅ **Visual feedback** - Users always know their session status

## 🚀 Usage

### In AdminDashboard

```jsx
import { useSessionTimeout } from '../../hooks/useSessionTimeout';
import SessionTimeoutWarning from '../../components/SessionTimeoutWarning';

const { showWarning, timeLeft, formatTime, extendSession, handleLogout } = 
  useSessionTimeout();

// Render the warning modal
<SessionTimeoutWarning
  show={showWarning}
  timeLeft={timeLeft}
  formatTime={formatTime}
  onExtend={extendSession}
  onLogout={() => handleLogout('manual')}
/>
```

## 📊 Customization Examples

### Stricter Security (5 min inactive, 1 hour max)
```javascript
INACTIVITY_TIMEOUT: 5 * 60 * 1000,
ABSOLUTE_TIMEOUT: 1 * 60 * 60 * 1000,
WARNING_TIME: 1 * 60 * 1000,
```

### Relaxed Security (30 min inactive, 8 hours max)
```javascript
INACTIVITY_TIMEOUT: 30 * 60 * 1000,
ABSOLUTE_TIMEOUT: 8 * 60 * 60 * 1000,
WARNING_TIME: 5 * 60 * 1000,
```

### Development (longer timeouts for testing)
```javascript
INACTIVITY_TIMEOUT: 60 * 60 * 1000,  // 1 hour
ABSOLUTE_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
WARNING_TIME: 5 * 60 * 1000,
```

## 🐛 Debugging

To debug session timeout issues:

1. Check browser console for logout messages
2. Verify timer events in React DevTools
3. Check sessionStorage for logout reasons
4. Monitor network tab for auth state changes

## 📝 Notes

- All timers are cleaned up on component unmount
- Session state persists across page refreshes
- Warning can be dismissed by clicking "Stay Logged In"
- Absolute timeout cannot be extended once reached
- Mobile devices track touch events separately

## 🔄 Future Enhancements

Potential improvements:
- [ ] Server-side session validation
- [ ] Multi-device session management
- [ ] Session activity logs
- [ ] Customizable warning messages
- [ ] Admin notification system
- [ ] Session history tracking

---

**Security Note**: Always test timeout settings thoroughly in your environment before deploying to production. Adjust values based on your specific security requirements and user experience needs.
