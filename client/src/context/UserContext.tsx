import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
};

type NewUser = {
  username: string;
  email: string;
  password: string;
  role?: "user" | "admin";
};

type UserContextType = {
  users: User[];
  fetchUsers: () => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  updateUser: (id: number, data: Partial<User>) => Promise<void>;
  createUser: (newUser: NewUser) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);

  // Récupérer le token du localStorage
  const token = localStorage.getItem("token");

  //Récupération des utilisateurs
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
        },
      });

      if (!res.ok) {
        console.error("Erreur fetchUsers :", res.statusText);
        return;
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Erreur réseau fetchUsers :", err);
    }
  }, [token]);

  // Créer un utilisateur
  const createUser = async (newUser: NewUser) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erreur création utilisateur: ${errorText}`);
      }

      // Recharger la liste des users si l'utilisateur courant est un admin
      await fetchUsers();
    } catch (err) {
      console.error(err);
      throw err; // pour que le composant appelant puisse gérer l'erreur
    }
  };

  // Supprimer un utilisateur
  const deleteUser = async (id: number) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
          },
        },
      );

      if (!res.ok) {
        console.error("Erreur suppression utilisateur :", res.statusText);
        return;
      }

      await fetchUsers();
    } catch (err) {
      console.error("Erreur réseau suppression utilisateur :", err);
    }
  };

  // Modifier un utilisateur
  const updateUser = async (id: number, data: Partial<User>) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token ?? ""}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!res.ok) {
        console.error("Erreur updateUser :", res.statusText);
        return;
      }

      await fetchUsers();
    } catch (err) {
      console.error("Erreur réseau updateUser :", err);
    }
  };

  useEffect(() => {
    // On ne fetch que si on a un token valide (admin connecté)
    if (token) {
      fetchUsers();
    }
  }, [fetchUsers, token]);

  return (
    <UserContext.Provider
      value={{ users, fetchUsers, deleteUser, updateUser, createUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUserContext doit être utilisé dans un UserProvider");
  return context;
};

export default UserProvider;
