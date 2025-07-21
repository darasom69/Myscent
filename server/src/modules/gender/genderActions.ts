import type { RequestHandler } from "express";
import genderRepository from "./genderRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const genders = await genderRepository.browse();
    res.status(200).json(genders);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const genderId = Number(req.params.id);
    if (Number.isNaN(genderId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    const gender = await genderRepository.read(genderId);
    if (!gender) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(gender);
  } catch (err) {
    next(err);
  }
};

export default { browse, read };
