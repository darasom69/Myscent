import type { RequestHandler } from "express";
import {
  type Status,
  readByUserAndStatus,
  remove,
  upsert,
} from "./collectionRepository";

const isStatus = (v: unknown): v is Status =>
  v === "owned" || v === "tested" || v === "wishlist";

// Empêche d'agir pour un autre utilisateur (suppose req.user alimenté par authenticateToken)
const ensureSameUser: RequestHandler = (req, res, next) => {
  // @ts-expect-error : selon le typing de ton middleware d'auth
  const authId = req.user?.id;
  const targetId = Number(req.params.userId);
  if (!authId || authId !== targetId) {
    res.status(403).json({ error: "forbidden" });
    return;
  }
  next();
};

const browse: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const type = String(req.query.type);
    if (!isStatus(type)) {
      res.status(400).json({ error: "invalid_type" });
      return;
    }
    const rows = await readByUserAndStatus(userId, type);
    res.json(rows);
  } catch (e: unknown) {
    next(e);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const { perfumeId, status } = req.body as {
      perfumeId?: number;
      status?: Status;
    };
    if (!perfumeId || !isStatus(status)) {
      res.status(400).json({ error: "missing_params" });
      return;
    }
    await upsert(userId, perfumeId, status);
    res.status(201).json({ ok: true });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "favorites_limit_reached") {
      res.status(409).json({ error: "favorites_limit_reached" });
      return;
    }
    next(e);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const perfumeId = Number(req.params.perfumeId);
    if (!perfumeId) {
      res.status(400).json({ error: "missing_perfume_id" });
      return;
    }
    await remove(userId, perfumeId);
    res.status(204).send();
  } catch (e: unknown) {
    next(e);
  }
};

export default {
  browse,
  add,
  destroy,
  ensureSameUser,
};
