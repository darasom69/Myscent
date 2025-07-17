import type { RequestHandler } from "express";
import perfumeRepository from "./perfumeRepository";

// GET /perfumes
const browse: RequestHandler = async (req, res, next) => {
  try {
    const perfumes = await perfumeRepository.browse();
    res.status(200).json(perfumes);
  } catch (error) {
    next(error);
  }
};

// GET /perfumes/:id
const read: RequestHandler = async (req, res, next) => {
  try {
    const perfumeId = Number(req.params.id);
    if (Number.isNaN(perfumeId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }

    const perfume = await perfumeRepository.read(perfumeId);
    if (!perfume) {
      res.sendStatus(404);
      return;
    }

    res.status(200).json(perfume);
  } catch (error) {
    next(error);
  }
};

// POST /perfumes
const add: RequestHandler = async (req, res, next) => {
  try {
    const { name, brand_id, release_year, gender_id, image_url, description } =
      req.body;

    if (!name || !brand_id || !release_year || !gender_id) {
      res.status(400).json({ error: "Champs requis manquants" });
      return;
    }

    const insertId = await perfumeRepository.create({
      name,
      brand_id,
      release_year,
      gender_id,
      image_url: image_url ?? null,
      description: description ?? null,
    });

    res.status(201).json({ insertId });
  } catch (error) {
    next(error);
  }
};

// PUT /perfumes/:id
const update: RequestHandler = async (req, res, next) => {
  try {
    const perfumeId = Number(req.params.id);
    if (Number.isNaN(perfumeId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }

    const { name, brand_id, release_year, gender_id, image_url, description } =
      req.body;

    const updated = await perfumeRepository.update(perfumeId, {
      name,
      brand_id,
      release_year,
      gender_id,
      image_url: image_url ?? null,
      description: description ?? null,
    });

    if (!updated) {
      res.sendStatus(404);
      return;
    }

    res.status(200).json({ message: "Parfum mis à jour" });
  } catch (error) {
    next(error);
  }
};

// DELETE /perfumes/:id
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const perfumeId = Number(req.params.id);
    if (Number.isNaN(perfumeId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }

    const deleted = await perfumeRepository.delete(perfumeId);
    if (!deleted) {
      res.sendStatus(404);
      return;
    }

    res.status(200).json({ message: "Parfum supprimé" });
  } catch (error) {
    next(error);
  }
};

export default {
  browse,
  read,
  add,
  update,
  destroy,
};
