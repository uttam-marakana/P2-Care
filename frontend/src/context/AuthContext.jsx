import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getProfile } from "@/services/cms";
import { firebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { isMockMode } from "@/lib/adminMode";
import { mockGetSession, mockProfile } from "@/services/mockAdmin";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const handleAuthExpired = () => {
      setSession(null);
      setProfile(null);
    };
    window.addEventListener("p2care-auth-expired", handleAuthExpired);
    if (isMockMode) {
      const syncMockSession = () => {
        const { session: mockSession } = mockGetSession();
        setSession(mockSession);
        setProfile(mockSession ? mockProfile() : null);
        setLoading(false);
      };
      syncMockSession();
      window.addEventListener("p2care-mock-auth", syncMockSession);
      return () => {
        window.removeEventListener("p2care-mock-auth", syncMockSession);
        window.removeEventListener("p2care-auth-expired", handleAuthExpired);
      };
    }
    if (!isFirebaseConfigured || !firebaseAuth) {
      setLoading(false);
      return () =>
        window.removeEventListener("p2care-auth-expired", handleAuthExpired);
    }
    let active = true;
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!active) return;
      if (!user) {
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      setSession({ user, access_token: await user.getIdToken() });
      try {
        setProfile(await getProfile(user.uid));
      } catch (_) {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => {
      active = false;
      unsubscribe();
      window.removeEventListener("p2care-auth-expired", handleAuthExpired);
    };
  }, []);
  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        configured: isMockMode || isFirebaseConfigured,
        mockMode: isMockMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
