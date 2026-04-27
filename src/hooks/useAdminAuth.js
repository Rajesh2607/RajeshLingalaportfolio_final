import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const useAdminAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // Primary: explicit admin doc keyed by uid.
          const adminByUidRef = doc(db, 'admins', currentUser.uid);
          const adminByUidSnap = await getDoc(adminByUidRef);

          if (adminByUidSnap.exists()) {
            setIsAdmin(true);
          } else {
            // Legacy fallback: admins/config with { emails: [] }.
            const configRef = doc(db, 'admins', 'config');
            const configSnap = await getDoc(configRef);
            const emails = configSnap.exists() ? configSnap.data().emails : [];
            setIsAdmin(Array.isArray(emails) && emails.includes(currentUser.email));
          }
        } catch (error) {
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
