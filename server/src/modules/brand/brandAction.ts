import type { RequestHandler } from "express";
import brandRepository from "./brandRepository";

// BROWSE
const browse: RequestHandler = async (req, res, next) => {
  try {
    const brands = await brandRepository.browse();
    res.status(200).json(brands);
  } catch (error) {
    next(error);
  }
};

// READ
const read: RequestHandler = async (req, res, next) => {
  try {
    const brandId = Number(req.params.id);
    if (Number.isNaN(brandId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    const brand = await brandRepository.read(brandId);
    if (!brand) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(brand);
  } catch (error) {
    next(error);
  }
};

// ADD
const add: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: "Le champ name est requis" });
      return;
    }
    const insertId = await brandRepository.create({ name });
    res.status(201).json({ insertId });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const update: RequestHandler = async (req, res, next) => {
  try {
    const brandId = Number(req.params.id);
    if (Number.isNaN(brandId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    const { name } = req.body;
    const affectedRows = await brandRepository.update(brandId, { name });
    if (!affectedRows) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

// DESTROY
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const brandId = Number(req.params.id);
    if (Number.isNaN(brandId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    const deleted = await brandRepository.destroy(brandId);
    if (!deleted) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json({ message: "Marque supprimée" });
  } catch (error) {
    next(error);
  }
};

export default { browse, read, add, update, destroy };
