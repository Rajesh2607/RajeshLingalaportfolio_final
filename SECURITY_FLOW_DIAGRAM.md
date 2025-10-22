# Security System Flow Diagram

## 🔄 Session Lifecycle Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LOGS IN                             │
│                              ↓                                   │
│                    Session Timer Starts                          │
│                    (sessionStartRef = now)                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    ACTIVE SESSION STATE                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Activity Monitoring (throttled to 1/second)             │  │
│  │  • Mouse movements    • Keyboard input                   │  │
│  │  • Clicks             • Scroll events                    │  │
│  │  • Touch interactions                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│        Each Activity → Reset Inactivity Timer                   │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Two Parallel Timers Running:                     │  │
│  │  1. Inactivity Timer (15 min default)                    │  │
│  │  2. Absolute Timer (2 hours default) ← CANNOT BE RESET   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    │                   │
        No Activity │                   │ Absolute Timeout
        for 13 min  │                   │ Reaches 2 hours
                    ↓                   ↓
┌───────────────────────────┐  ┌───────────────────────────┐
│   WARNING PHASE           │  │  IMMEDIATE LOGOUT         │
│  (2 minutes before)       │  │  (No Warning)             │
├───────────────────────────┤  ├───────────────────────────┤
│  • Modal appears          │  │  • Force logout           │
│  • Countdown: 2:00        │  │  • Reason: absolute       │
│  • User can see timer     │  │  • Redirect to login      │
│  • Pulse animation        │  │  • Show message           │
└───────────────────────────┘  └───────────────────────────┘
            ↓
    ┌───────┴────────┐
    │                │
    │ User Action?   │
    │                │
    └───────┬────────┘
            │
    ┌───────┴────────┐
    │                │
    ↓                ↓
┌─────────┐    ┌──────────┐
│ Extend  │    │ Logout   │
│ Session │    │ Now      │
└─────────┘    └──────────┘
    │                │
    │                ↓
    │          ┌──────────────────┐
    │          │  Manual Logout   │
    │          │  • Clear timers  │
    │          │  • Sign out      │
    │          │  • Redirect      │
    │          └──────────────────┘
    │
    ↓
┌───────────────────────────┐
│  Session Extended         │
│  • Reset inactivity timer │
│  • Check absolute timeout │
│  • Hide warning modal     │
│  • Continue session       │
└───────────────────────────┘
    │
    └─────────────────┐
                      ↓
            Back to ACTIVE SESSION STATE
```

## 🎯 Timer Relationships

```
Absolute Timer (2h)
├─────────────────────────────────────────────────────┤
                                        ↑
                                        │
                            Absolute timeout reached
                            → IMMEDIATE LOGOUT

Inactivity Timer (15m)
├───────────────┤ → Reset on activity
                ├───────────────┤ → Reset on activity
                                ├───────────────┤
                                        ↑
                                        │ 13min mark
                                        └─────→ WARNING PHASE (2min)
                                                ├──────────┤
                                                          ↑
                                                          │
                                                    15min → LOGOUT
```

## 🔔 Warning Modal States

```
┌──────────────────────────────────────────┐
│        SESSION TIMEOUT WARNING            │
├──────────────────────────────────────────┤
│                                           │
│        ┌─────────────────┐               │
│        │   COUNTDOWN     │               │
│        │      1:45       │ ← Real-time   │
│        │   remaining     │   countdown   │
│        └─────────────────┘               │
│                                           │
│  "Due to inactivity, you will be         │
│   automatically logged out..."           │
│                                           │
│  ┌─────────────┐  ┌──────────────┐      │
│  │ Stay Logged │  │  Logout Now  │      │
│  │     In      │  │              │      │
│  └─────────────┘  └──────────────┘      │
└──────────────────────────────────────────┘
        ↓                    ↓
    Reset Timer        Immediate Logout
```

## 🎨 Component Architecture

```
AdminDashboard.jsx
    │
    ├─→ useSessionTimeout() Hook
    │       │
    │       ├─→ Track Activity Events
    │       ├─→ Manage Timers
    │       ├─→ Handle Warnings
    │       └─→ Execute Logout
    │
    └─→ SessionTimeoutWarning Component
            │
            ├─→ Display Modal
            ├─→ Show Countdown
            ├─→ Handle User Actions
            └─→ Communicate with Hook
```

## 📦 Data Flow

```
Activity Detected
      ↓
useSessionTimeout Hook
      ↓
Throttle Check (1s)
      ↓
Reset Inactivity Timer
      ↓
Check Absolute Timeout
      ↓
    ┌─┴─┐
    │   │
    Yes │ No
    │   │
    ↓   └─→ Continue Session
Logout       ↓
          Set Warning Timer
                ↓
          Warning Time Reached
                ↓
          showWarning = true
                ↓
    SessionTimeoutWarning Modal
                ↓
          User Interaction
                ↓
        ┌───────┴────────┐
        ↓                ↓
    Extend         Logout Now
    Session             ↓
        ↓           Force Logout
    Reset Timer         ↓
        ↓           Redirect
    Continue        to Login
```

## 🔐 Security Checkpoints

```
┌────────────────────────────────────────┐
│      SECURITY CHECKPOINT FLOW          │
├────────────────────────────────────────┤
│                                        │
│  1. ✓ User Authentication              │
│     └─→ Firebase Auth Check            │
│                                        │
│  2. ✓ Session Initialization           │
│     └─→ Start Both Timers              │
│                                        │
│  3. ✓ Continuous Monitoring            │
│     └─→ Activity Event Listeners       │
│                                        │
│  4. ✓ Warning Phase                    │
│     └─→ User Notification              │
│                                        │
│  5. ✓ Timeout Enforcement              │
│     └─→ Automatic Logout               │
│                                        │
│  6. ✓ Clean Session Termination        │
│     └─→ Clear All Timers & State       │
│                                        │
│  7. ✓ Logout Reason Tracking           │
│     └─→ Store in SessionStorage        │
│                                        │
│  8. ✓ Login Page Notification          │
│     └─→ Display Logout Reason          │
│                                        │
└────────────────────────────────────────┘
```

## 🧪 Testing Scenarios

### Scenario 1: Normal Session
```
Login → Activity → Activity → ... → Manual Logout
  ↓       ↓          ↓               ↓
Start   Reset      Reset         Clean Exit
Timer   Timer      Timer
```

### Scenario 2: Inactivity Logout
```
Login → Activity → No Activity (13m) → Warning → No Response → Auto Logout
  ↓       ↓            ↓                ↓           ↓             ↓
Start   Reset    Warning Phase      2:00...     0:00        Redirect
Timer   Timer      Starts            1:59        
```

### Scenario 3: Absolute Timeout
```
Login → Active for 1h 59m → Warning → Active → 2h Mark → Force Logout
  ↓         ↓                  ↓        ↓          ↓            ↓
Start    Resets           Warning   Extend    Absolute      Immediate
Timer   Constantly         Shows    Disabled   Reached       Logout
```

### Scenario 4: Warning Extension
```
Login → 13min Inactive → Warning → Click "Stay Logged In" → Continue
  ↓           ↓              ↓              ↓                    ↓
Start      Warning       Modal          Reset                Back to
Timer       Phase        Shows          Timer               Normal State
```

---

**Legend:**
- `→` : Process flow
- `↓` : Next step
- `├─→` : Branch/Option
- `┌─┴─┐` : Decision point
- `✓` : Security checkpoint
