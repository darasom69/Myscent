import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  created_at?: string;
}

class UsersRepository {
  // Créer un utilisateur
  async create(user: Omit<User, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [user.username, user.email, user.password, user.role],
    );
    return result.insertId;
  }

  // Lire tous les utilisateurs (utile pour un admin)
  async browse() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, username, email, role, created_at FROM users",
    );
    return rows as Omit<User, "password">[];
  }

  // Lire un utilisateur par ID
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, username, email, role, created_at FROM users WHERE id = ?",
      [id],
    );
    return (rows as Omit<User, "password">[])[0] || null;
  }

  // Lire un utilisateur par email (pour login)
  async findByEmail(email: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    return (rows as User[])[0] || null;
  }

  // Mettre à jour un utilisateur (ex: admin modifie role)
  async update(id: number, partialUser: Partial<User>) {
    // On récupère l'utilisateur existant
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM users WHERE id = ?",
      [id],
    );
    const existingUser = (rows as User[])[0];

    if (!existingUser) {
      throw new Error("Utilisateur introuvable");
    }

    // On fusionne les données existantes et les nouvelles
    const updatedUser = {
      username: partialUser.username ?? existingUser.username,
      email: partialUser.email ?? existingUser.email,
      role: partialUser.role ?? existingUser.role,
    };

    const [result] = await databaseClient.query<Result>(
      "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?",
      [updatedUser.username, updatedUser.email, updatedUser.role, id],
    );

    return result.affectedRows;
  }

  // Supprimer un utilisateur
  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM users WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  }
}

export default new UsersRepository();
