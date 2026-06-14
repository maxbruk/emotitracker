import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

function useDataManager(key, initialValue) {
  const { currentUser } = useAuth();
  
  // Local storage state
  const [localValue, setLocalValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  // Cloud state
  const [cloudValue, setCloudValue] = useState(initialValue);
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setIsCloudLoaded(false);
      return;
    }

    const userDocRef = doc(db, 'users', currentUser.uid);

    // Initial migration/merge logic
    const initializeCloudData = async () => {
      try {
        const docSnap = await getDoc(userDocRef);
        const localDataRaw = window.localStorage.getItem(key);
        const localData = localDataRaw ? JSON.parse(localDataRaw) : null;

        if (!docSnap.exists()) {
          // First time ever - migrate local data if exists
          if (localData) {
            await setDoc(userDocRef, { [key]: localData }, { merge: true });
          }
        } else {
          // Document exists, but we might have local items that need merging
          const cloudData = docSnap.data()[key];
          
          if (localData && Array.isArray(localData) && Array.isArray(cloudData)) {
            // Smart merge for arrays (like items) by ID
            const mergedMap = new Map();
            // Put cloud items first
            cloudData.forEach(item => mergedMap.set(item.id, item));
            // Add local items (will not overwrite cloud items if ID exists, or we can overwrite if newer)
            localData.forEach(item => {
              if (!mergedMap.has(item.id)) {
                mergedMap.set(item.id, item);
              }
            });
            const mergedArray = Array.from(mergedMap.values());
            
            // Only update if we actually added local items to cloud
            if (mergedArray.length > cloudData.length) {
              await setDoc(userDocRef, { [key]: mergedArray }, { merge: true });
            }
          }
        }
      } catch (err) {
        console.error("Migration error:", err);
      }
    };

    initializeCloudData();

    // Listen to real-time changes
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data[key] !== undefined) {
          setCloudValue(data[key]);
        }
      }
      setIsCloudLoaded(true);
    });

    return () => unsubscribe();
  }, [currentUser, key]);

  const setValue = async (value) => {
    try {
      // Determine what the "previous" value was
      const currentValue = currentUser ? cloudValue : localValue;
      const valueToStore = value instanceof Function ? value(currentValue) : value;

      if (currentUser) {
        // Save to Firebase
        // Optimistic UI update
        setCloudValue(valueToStore);
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(userDocRef, { [key]: valueToStore }, { merge: true });
        
        // Also clear local storage so it doesn't get confusing on logout
        if (window.localStorage.getItem(key)) {
           window.localStorage.removeItem(key);
        }
      } else {
        // Save locally
        setLocalValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Return the correct value based on auth state
  // Wait for cloud to load initially to prevent flickering empty states
  const activeValue = currentUser ? (isCloudLoaded ? cloudValue : cloudValue) : localValue;

  return [activeValue, setValue];
}

export default useDataManager;
