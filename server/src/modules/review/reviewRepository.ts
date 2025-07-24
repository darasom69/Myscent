import type { Result, Rows } from "../../../database/client";
import client from "../../../database/client";

type Review = {
  id?: number;
  perfume_id: number;
  user_id: number;
  rating: number;
  text: string;
  created_at?: string;
};

// Browse all reviews
const browse = async (): Promise<Rows> => {
  const [rows] = await client.query(
    `SELECT r.*, u.username AS user_name
     FROM review r
     JOIN user u ON r.user_id = u.id
     ORDER BY r.created_at DESC`,
  );
  return rows as Rows;
};

// Get reviews by perfume id
const findByPerfume = async (perfumeId: number): Promise<Rows> => {
  const [rows] = await client.query(
    `SELECT r.*, u.username AS user_name
     FROM review r
     JOIN user u ON r.user_id = u.id
     WHERE r.perfume_id = ?
     ORDER BY r.created_at DESC`,
    [perfumeId],
  );
  return rows as Rows;
};

// Create new review
const create = async (review: Review): Promise<number> => {
  const [result] = await client.query<Result>(
    `INSERT INTO review (perfume_id, user_id, rating, text, created_at)
     VALUES (?, ?, ?, ?, NOW())`,
    [review.perfume_id, review.user_id, review.rating, review.text],
  );
  return result.insertId;
};

// Update review
const update = async (
  id: number,
  review: Partial<Review>,
): Promise<boolean> => {
  const [result] = await client.query<Result>(
    "UPDATE review SET rating = ?, text = ? WHERE id = ?",
    [review.rating, review.text, id],
  );
  return result.affectedRows > 0;
};

// Delete review
const destroy = async (id: number): Promise<boolean> => {
  const [result] = await client.query<Result>(
    "DELETE FROM review WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
};

export default { browse, findByPerfume, create, update, destroy };
export type { Review };
