import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  loading: boolean;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("alyvex_owner_token");
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) {
        setIsAuthenticated(false);
        localStorage.removeItem("alyvex_owner_token");
        setLoading(false);
      }
    }, 10000);

    api
      .validate()
      .then((res) => {
        if (cancelled) return;
        clearTimeout(timer);
        setIsAuthenticated(res.valid);
        if (!res.valid) localStorage.removeItem("alyvex_owner_token");
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        clearTimeout(timer);
        setIsAuthenticated(false);
        localStorage.removeItem("alyvex_owner_token");
        setLoading(false);
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const login = useCallback(async (password: string) => {
    await api.login(password);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
