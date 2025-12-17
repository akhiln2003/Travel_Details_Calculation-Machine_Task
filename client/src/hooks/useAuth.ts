import { useEffect, useState } from "react";

const TOKEN_KEY = "tdc_token";
const USER_KEY = "tdc_user";

export interface AuthUser {
  id: string;
  email: string;
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return { token, setToken, user, setUser, logout };
};

