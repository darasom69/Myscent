import type { RequestHandler } from "express";
import reviewRepository from "./reviewRepository";

// Liste tous les reviews
const browse: RequestHandler = async (_req, res, next) => {
  try {
    const rows = await reviewRepository.browse();
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

// Reviews d’un parfum
const findByPerfume: RequestHandler = async (req, res, next) => {
  try {
    const perfumeId = Number(req.params.perfumeId);
    if (Number.isNaN(perfumeId)) {
      res.status(400).json({ error: "invalid_perfume_id" });
      return;
    }
    const rows = await reviewRepository.findByPerfume(perfumeId);
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

// Création d’un avis — accepte comment|text et perfume_id|perfumeId
const add: RequestHandler = async (req, res, next) => {
  try {
    // user id depuis le token
    // @ts-expect-error selon ton middleware
    const authUserId: number | undefined = req.user?.id;

    const perfume_id = Number(req.body.perfume_id ?? req.body.perfumeId);
    const rating = Number(req.body.rating);
    const rawText: unknown = req.body.comment ?? req.body.text;
    const comment =
      typeof rawText === "string"
        ? rawText.trim()
        : String(rawText ?? "").trim();

    if (!authUserId) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }
    if (!perfume_id || Number.isNaN(perfume_id)) {
      res.status(400).json({ error: "missing_perfume_id" });
      return;
    }
    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ error: "invalid_rating" });
      return;
    }
    if (!comment) {
      res.status(400).json({ error: "missing_comment" });
      return;
    }

    const insertId = await reviewRepository.create({
      perfume_id,
      user_id: authUserId,
      rating,
      comment,
    });

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

// Modifier un avis
const update: RequestHandler = async (req, res, next) => {
  try {
    const reviewId = Number(req.params.id);
    const rating =
      req.body.rating != null ? Number(req.body.rating) : undefined;
    const comment: string | undefined =
      typeof req.body.comment === "string"
        ? req.body.comment
        : typeof req.body.text === "string"
          ? req.body.text
          : undefined;

    if (Number.isNaN(reviewId)) {
      res.status(400).json({ error: "invalid_id" });
      return;
    }
    if (rating != null && (rating < 1 || rating > 5)) {
      res.status(400).json({ error: "invalid_rating" });
      return;
    }

    const ok = await reviewRepository.update(reviewId, {
      rating,
      comment: comment ?? null,
    });
    if (!ok) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

// Supprimer un avis
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const reviewId = Number(req.params.id);
    if (Number.isNaN(reviewId)) {
      res.status(400).json({ error: "invalid_id" });
      return;
    }
    const ok = await reviewRepository.destroy(reviewId);
    if (!ok) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

export default { browse, findByPerfume, add, update, destroy };
