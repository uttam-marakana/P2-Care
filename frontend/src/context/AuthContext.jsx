import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
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
  const profileRequest = useRef(0);
  const refreshProfile = useCallback(async () => {
    if (isMockMode) {
      const { session: mockSession } = mockGetSession();
      setSession(mockSession);
      setProfile(mockSession ? mockProfile() : null);
      return mockSession ? mockProfile() : null;
    }
    const user = firebaseAuth?.currentUser;
    if (!user) {
      setProfile(null);
      return null;
    }
    const requestId = ++profileRequest.current;
    const nextProfile = await getProfile(user.uid);
    if (requestId === profileRequest.current) setProfile(nextProfile);
    return nextProfile;
  }, []);
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
        profileRequest.current += 1;
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      setSession({ user, access_token: await user.getIdToken() });
      const requestId = ++profileRequest.current;
      try {
        const nextProfile = await getProfile(user.uid);
        if (active && requestId === profileRequest.current) setProfile(nextProfile);
      } catch (_) {
        if (active && requestId === profileRequest.current) setProfile(null);
      }
      if (active) setLoading(false);
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
        refreshProfile,
        configured: isMockMode || isFirebaseConfigured,
        mockMode: isMockMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
