import type { RequestHandler } from "express";
import olfactoryNoteRepository from "./olfactoryNoteRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const notes = await olfactoryNoteRepository.browse();
    res.status(200).json(notes);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const noteId = Number(req.params.id);
    if (Number.isNaN(noteId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    const note = await olfactoryNoteRepository.read(noteId);
    if (!note) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export default { browse, read };
