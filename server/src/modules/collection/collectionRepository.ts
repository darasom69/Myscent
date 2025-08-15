import type { RowDataPacket } from "mysql2";
import databaseClient from "../../../database/client";

export type Status = "owned" | "tested" | "wishlist";

type UserCollectionRow = {
  status: Status;
} & RowDataPacket;

type CountRow = {
  c: number;
} & RowDataPacket;

type PerfumeRow = {
  id: number;
  name: string;
  image_url: string;
} & RowDataPacket;

class CustomError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, CustomError.prototype); // Maintain proper prototype chain
  }
}

// Vérifie si une ligne existe déjà (pour connaître l'ancien statut)
async function getExistingStatus(userId: number, perfumeId: number) {
  const [rows] = await databaseClient.query<UserCollectionRow[]>(
    "SELECT status FROM user_collection WHERE user_id = ? AND perfume_id = ?",
    [userId, perfumeId],
  );
  return rows?.[0]?.status as Status | undefined;
}

// Compte le nombre d'éléments dans la wishlist (pour la limite 10)
async function countWishlist(userId: number) {
  const [rows] = await databaseClient.query<CountRow[]>(
    "SELECT COUNT(*) AS c FROM user_collection WHERE user_id = ? AND status = 'wishlist'",
    [userId],
  );
  return Number(rows?.[0]?.c ?? 0);
}

// Liste les parfums pour un user + statut donné
export async function readByUserAndStatus(userId: number, status: Status) {
  const [rows] = await databaseClient.query<PerfumeRow[]>(
    `SELECT p.*
     FROM user_collection uc
     JOIN perfume p ON p.id = uc.perfume_id
     WHERE uc.user_id = ? AND uc.status = ?
     ORDER BY uc.added_date DESC`,
    [userId, status],
  );
  return rows;
}

// Insère ou met à jour le statut (PK = user_id + perfume_id).Applique la limite 10 si on entre en wishlist.

export async function upsert(
  userId: number,
  perfumeId: number,
  status: Status,
) {
  const previous = await getExistingStatus(userId, perfumeId);
  const goingToWishlist = status === "wishlist" && previous !== "wishlist";

  if (goingToWishlist) {
    const count = await countWishlist(userId);
    if (count >= 10) {
      throw new CustomError("favorites_limit_reached", "FAVORITES_LIMIT");
    }
  }

  await databaseClient.query(
    `INSERT INTO user_collection (user_id, perfume_id, status)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE status = VALUES(status), added_date = NOW()`,
    [userId, perfumeId, status],
  );
}

// Supprime l'entrée (quel que soit son statut)
export async function remove(userId: number, perfumeId: number) {
  await databaseClient.query(
    "DELETE FROM user_collection WHERE user_id = ? AND perfume_id = ?",
    [userId, perfumeId],
  );
}
