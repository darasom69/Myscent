import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

export interface OlfactoryFamily {
  id: number;
  name: string;
}

class OlfactoryFamilyRepository {
  async browse(): Promise<OlfactoryFamily[]> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, name FROM olfactory_family ORDER BY name ASC",
    );
    return rows as OlfactoryFamily[];
  }

  async read(id: number): Promise<OlfactoryFamily | null> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, name FROM olfactory_family WHERE id = ?",
      [id],
    );
    return (rows as OlfactoryFamily[])[0] || null;
  }
}

export default new OlfactoryFamilyRepository();
