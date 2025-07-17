import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

interface Perfume {
  id: number;
  name: string;
  brand_id: number;
  release_year: number;
  gender_id: number;
  image_url?: string | null;
  description?: string | null;
}

class PerfumeRepository {
  // Le C du CRUD - Create
  async create(perfume: Omit<Perfume, "id">) {
    // Création d'un nouveau parfum
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO perfume (name, brand_id, release_year, gender_id, image_url, description) values (?, ?, ?, ?, ?, ?)",
      [
        perfume.name,
        perfume.brand_id,
        perfume.release_year,
        perfume.gender_id,
        perfume.image_url ?? null,
        perfume.description ?? null,
      ],
    );
    //Retourne l'ID du nouveau parfum inséré
    return result.insertId;
  }
  // Le R du CRUD - Read
  async read(id: number) {
    // Execute la requête SQL pour lire un item spécifique par son ID
    const [rows] = await databaseClient.query<Rows>(
      "select * from perfume where id = ?",
      [id],
    );
    //Retourne la première ligne du résultat de la requête
    return (rows as Perfume[])[0] || null;
  }
  async browse() {
    // Exécute la requête SQL pour lire tout le tableau de la table "perfume"
    const [rows] = await databaseClient.query<Rows>(
      "select * from perfume ORDER BY name ASC",
    );

    // Return the array of items
    return rows as Perfume[];
  }

  // Le U du CRUD - Update
  async update(id: number, perfume: Omit<Perfume, "id">) {
    // Exécute la requête SQL pour lire tout le tableau de la table "perfume"
    const [result] = await databaseClient.query<Result>(
      "UPDATE perfume set name = ?, brand_id = ?, release_year = ?, gender_id = ?, image_url = ?, description = ? WHERE id = ?",
      [
        perfume.name,
        perfume.brand_id,
        perfume.release_year,
        perfume.gender_id,
        perfume.image_url ?? null,
        perfume.description ?? null,
        id,
      ],
    );

    // Retourne le tableau de parfums mis à jour

    return result.affectedRows;
  }
  // Le D du CRUD - destroy
  async destroy(id: number) {
    // Exécute la requête SQL pour supprimer un parfum spécifique par son ID
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM perfume WHERE id = ?",
      [id],
    );
    // Retourne le nombre de lignes affectées par la suppression
    return result.affectedRows;
  }
}

export default new PerfumeRepository();
