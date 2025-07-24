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
      res.status(400).json({ error: "ID parfum invalide" });
      return;
    }
    const rows = await reviewRepository.findByPerfume(perfumeId);
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

// Créer un avis
const add: RequestHandler = async (req, res, next) => {
  try {
    const { perfume_id, user_id, rating, text } = req.body;
    if (!perfume_id || !user_id || !rating || !text) {
      res.status(400).json({ error: "Champs requis manquants" });
      return;
    }
    const insertId = await reviewRepository.create({
      perfume_id,
      user_id,
      rating,
      text,
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
    const { rating, text } = req.body;
    if (Number.isNaN(reviewId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    const ok = await reviewRepository.update(reviewId, { rating, text });
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
      res.status(400).json({ error: "ID invalide" });
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
