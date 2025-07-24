import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type User = {
  id: number;
  username: string;
  role: "user" | "admin";
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Charger depuis localStorage au montage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  // Connexion
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!res.ok) return false;

      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      return true;
    } catch (error) {
      console.error("Erreur login :", error);
      return false;
    }
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAdmin: user?.role === "admin",
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext doit être utilisé dans un AuthProvider");
  }
  return context;
};
