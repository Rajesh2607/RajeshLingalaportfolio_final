import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const useAdminAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const isLegacyEmailAdmin = async (email) => {
    const normalizedEmail = (email || '').trim().toLowerCase();

    try {
      const mainRef = doc(db, 'admins', 'main');
      const mainSnap = await getDoc(mainRef);
      const mainEmail = mainSnap.exists() ? String(mainSnap.data().email || '').trim().toLowerCase() : '';
      if (mainEmail && mainEmail === normalizedEmail) {
        return true;
      }
    } catch (e) {
      console.error('useAdminAuth.isLegacyEmailAdmin: failed to read admins/main', e);
    }

    try {
      // Existing legacy document in your database from previous setup.
      const legacyRef = doc(db, 'admins', 'h423cObkVbSra5wB0HmC');
      const legacySnap = await getDoc(legacyRef);
      const legacyEmail = legacySnap.exists() ? String(legacySnap.data().email || '').trim().toLowerCase() : '';
      return legacyEmail && legacyEmail === normalizedEmail;
    } catch (e) {
      console.error('useAdminAuth.isLegacyEmailAdmin: failed to read legacy admin doc', e);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.debug('onAuthStateChanged:', currentUser && { uid: currentUser.uid, email: currentUser.email });
      setUser(currentUser);

      if (currentUser) {
        try {
          // UID-based admin authorization (source of truth).
          const adminByUidRef = doc(db, 'admins', currentUser.uid);
          const adminByUidSnap = await getDoc(adminByUidRef);

          if (adminByUidSnap.exists()) {
            setIsAdmin(true);
          } else {
            const legacy = await isLegacyEmailAdmin(currentUser.email);
            console.debug('legacy admin check for', currentUser.email, legacy);
            setIsAdmin(legacy);
          }
        } catch (error) {
          console.error('useAdminAuth error checking admin docs', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, isAdmin };
};
