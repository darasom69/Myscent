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

  // Récupération des users
  const fetchUsers = useCallback(async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
    const data = await res.json();
    setUsers(data);
  }, []);

  // Créer un utilisateur
  const createUser = async (newUser: NewUser) => {
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

    await fetchUsers(); // mettre à jour la liste après création
  };

  // Supprimer un utilisateur
  const deleteUser = async (id: number) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
      method: "DELETE",
    });
    fetchUsers();
  };

  // Modifier un utilisateur
  const updateUser = async (id: number, data: Partial<User>) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
