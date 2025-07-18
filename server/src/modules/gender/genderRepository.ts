import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

export interface Gender {
  id: number;
  name: string;
}

class GenderRepository {
  async browse(): Promise<Gender[]> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, name FROM gender ORDER BY name ASC",
    );
    return rows as Gender[];
  }

  async read(id: number): Promise<Gender | null> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, name FROM gender WHERE id = ?",
      [id],
    );
    return (rows as Gender[])[0] || null;
  }
}

export default new GenderRepository();
