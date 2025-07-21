import type { RequestHandler } from "express";
import olfactoryFamilyRepository from "./olfactoryFamilyRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const families = await olfactoryFamilyRepository.browse();
    res.status(200).json(families);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const familyId = Number(req.params.id);
    if (Number.isNaN(familyId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    const family = await olfactoryFamilyRepository.read(familyId);
    if (!family) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(family);
  } catch (err) {
    next(err);
  }
};

export default { browse, read };
