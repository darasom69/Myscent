import type { ResultSetHeader } from "mysql2";
import databaseClient from "../../../database/client";

interface Perfume {
  name: string;
  brand_id: number;
  release_year: number;
  gender_id: number;
  image_url?: string | null;
  description?: string | null;
}

const browse = async () => {
  const [rows] = await databaseClient.query(
    `
    SELECT
      p.id,
      p.name,
      p.release_year,
      p.image_url,
      p.description,
      b.name AS brand,
      g.name AS gender
    FROM perfume AS p
    JOIN brand AS b ON p.brand_id = b.id
    JOIN gender AS g ON p.gender_id = g.id
    ORDER BY p.name ASC
    `,
  );
  return rows;
};

const read = async (id: number) => {
  const [rows] = await databaseClient.query(
    `
    SELECT
      p.id,
      p.name,
      p.release_year,
      p.image_url,
      p.description,
      b.name AS brand,
      g.name AS gender
    FROM perfume AS p
    JOIN brand AS b ON p.brand_id = b.id
    JOIN gender AS g ON p.gender_id = g.id
    WHERE p.id = ?
    `,
    [id],
  );
  return (rows as Perfume[])[0] || null;
};

const create = async (perfume: Perfume) => {
  const [result] = await databaseClient.query<ResultSetHeader>(
    `
    INSERT INTO perfume
      (name, brand_id, release_year, gender_id, image_url, description)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      perfume.name,
      perfume.brand_id,
      perfume.release_year,
      perfume.gender_id,
      perfume.image_url ?? null,
      perfume.description ?? null,
    ],
  );
  return result.insertId;
};

const update = async (id: number, perfume: Perfume) => {
  const [result] = await databaseClient.query<ResultSetHeader>(
    `
    UPDATE perfume
    SET
      name = ?,
      brand_id = ?,
      release_year = ?,
      gender_id = ?,
      image_url = ?,
      description = ?
    WHERE id = ?
    `,
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
  browse,
  read,
  create,
  update,
  delete: deletePerfume,
};
