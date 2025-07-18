import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

interface Brand {
  id: number;
  name: string;
}

class BrandRepository {
  // CREATE
  async create(brand: Omit<Brand, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO brand (name) VALUES (?)",
      [brand.name],
    );
    return result.insertId;
  }

  // READ (one)
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM brand WHERE id = ?",
      [id],
    );
    return (rows as Brand[])[0] || null;
  }

  // READ ALL (browse)
  async browse() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM brand ORDER BY name ASC",
    );
    return rows as Brand[];
  }

  // UPDATE
  async update(id: number, brand: Omit<Brand, "id">) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE brand SET name = ? WHERE id = ?",
      [brand.name, id],
    );
    return result.affectedRows;
  }

  // DELETE
  async destroy(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM brand WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  }
}

export default new BrandRepository();
