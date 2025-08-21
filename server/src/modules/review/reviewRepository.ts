import type { Result, Rows } from "../../../database/client";
import client from "../../../database/client";

type Review = {
  id?: number;
  perfume_id: number;
  user_id: number;
  rating: number; // 1..5
  comment: string | null;
  review_date?: string; // TIMESTAMP
};

// Liste tous les avis
const browse = async (): Promise<Rows> => {
  const [rows] = await client.query(
    `SELECT r.*, u.username AS user_name
     FROM review r
     JOIN users u ON r.user_id = u.id
     ORDER BY r.review_date DESC`,
  );
  return rows as Rows;
};

// Avis d’un parfum
const findByPerfume = async (perfumeId: number): Promise<Rows> => {
  const [rows] = await client.query(
    `SELECT r.*, u.username AS user_name
     FROM review r
     JOIN users u ON r.user_id = u.id
     WHERE r.perfume_id = ?
     ORDER BY r.review_date DESC`,
    [perfumeId],
  );
  return rows as Rows;
};

// Créer un avis
const create = async (review: Review): Promise<number> => {
  const [result] = await client.query<Result>(
    `INSERT INTO review (rating, comment, user_id, perfume_id)
     VALUES (?, ?, ?, ?)`,
    [review.rating, review.comment ?? null, review.user_id, review.perfume_id],
  );
  return result.insertId;
};

// Mettre à jour un avis
const update = async (
  id: number,
  review: Partial<Review>,
): Promise<boolean> => {
  const [result] = await client.query<Result>(
    `UPDATE review
     SET rating = ?, comment = ?, review_date = NOW()
     WHERE id = ?`,
    [review.rating, review.comment ?? null, id],
  );
  return result.affectedRows > 0;
};

// Supprimer un avis
const destroy = async (id: number): Promise<boolean> => {
  const [result] = await client.query<Result>(
    "DELETE FROM review WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
};

const reviewRepository = { browse, findByPerfume, create, update, destroy };
export default reviewRepository;
