import { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebaseSetup';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const auth = getAuth(app);
    const db = getFirestore(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch extended user info (role, name, college) from Firestore
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        setUser({ uid: firebaseUser.uid, ...userDoc.data() });
                    } else {
                        // If no firestore doc exists, default to their auth metadata
                        setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'student' });
                    }
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, db]);

    const logout = async () => {
        try {
            await signOut(auth);
            window.location.replace('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
