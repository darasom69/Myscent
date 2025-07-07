import type { ResultSetHeader } from "mysql2";
import databaseClient from "../../../../database/client";

interface Perfume {
  name: string;
  brand_id: number;
  release_year: number;
  main_gender_id: number;
  perceived_gender_id?: number | null;
  image_url?: string | null;
}

const readAll = async () => {
  const [rows] = await databaseClient.query(
    "SELECT * FROM perfume ORDER BY name ASC",
  );
  return rows;
};

const read = async (id: number) => {
  const [rows] = await databaseClient.query(
    "SELECT * FROM perfume WHERE id = ?",
    [id],
  );
  return (rows as Perfume[])[0] || null;
};

const create = async (perfume: Perfume) => {
  const [result] = await databaseClient.query<ResultSetHeader>(
    `INSERT INTO perfume
     (name, brand_id, release_year, main_gender_id, perceived_gender_id, image_url)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      perfume.name,
      perfume.brand_id,
      perfume.release_year,
      perfume.main_gender_id,
      perfume.perceived_gender_id || null,
      perfume.image_url || null,
    ],
  );
  return result.insertId;
};

const update = async (id: number, perfume: Perfume) => {
  const [result] = await databaseClient.query<ResultSetHeader>(
    `UPDATE perfume SET
     name = ?,
     brand_id = ?,
     release_year = ?,
     main_gender_id = ?,
     perceived_gender_id = ?,
     image_url = ?
     WHERE id = ?`,
    [
      perfume.name,
      perfume.brand_id,
      perfume.release_year,
      perfume.main_gender_id,
      perfume.perceived_gender_id || null,
      perfume.image_url || null,
      id,
    ],
  );
  return result.affectedRows > 0;
};

const deletePerfume = async (id: number) => {
  const [result] = await databaseClient.query<ResultSetHeader>(
    "DELETE FROM perfume WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
};

export default {
  readAll,
  read,
  create,
  update,
  delete: deletePerfume,
};
