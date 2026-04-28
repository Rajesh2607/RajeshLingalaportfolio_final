import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Configure storage using Vite env var if available. The SDK accepts a
// 'gs://...' URL, so normalize the value if the env provides only the bucket hostname.
const rawStorageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
let storageBucketUrl = undefined;
if (rawStorageBucket) {
  storageBucketUrl = rawStorageBucket.startsWith('gs://')
    ? rawStorageBucket
    : `gs://${rawStorageBucket}`;
  console.debug('Using storage bucket:', storageBucketUrl);
} else {
  console.warn('VITE_FIREBASE_STORAGE_BUCKET is not set — using default app storage bucket');
}

export const storage = storageBucketUrl ? getStorage(app, storageBucketUrl) : getStorage(app);

/**
 * Refresh the current user's ID token to ensure recent claims (email, custom claims)
 * are available to Firestore/Storage security rules. Returns true on success.
 */
export const refreshAuthToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    await user.getIdToken(true);
    console.debug('ID token refreshed for', user.uid);
    return true;
  } catch (e) {
    console.error('Failed to refresh ID token', e);
    return false;
  }
};