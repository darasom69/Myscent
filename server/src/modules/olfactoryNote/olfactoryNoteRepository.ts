import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

export interface OlfactoryNote {
  id: number;
  name: string;
}

class OlfactoryNoteRepository {
  async browse(): Promise<OlfactoryNote[]> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, name FROM olfactory_note ORDER BY name ASC",
    );
    return rows as OlfactoryNote[];
  }

  async read(id: number): Promise<OlfactoryNote | null> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, name FROM olfactory_note WHERE id = ?",
      [id],
    );
    return (rows as OlfactoryNote[])[0] || null;
  }
}

export default new OlfactoryNoteRepository();
