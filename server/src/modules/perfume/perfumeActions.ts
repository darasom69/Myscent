import type { RequestHandler } from "express";
import type { Request, Response } from "express";
import client from "../../../database/client";
import perfumeRepository from "./perfumeRepository";

type NoteRow = {
  note_type: string;
  note_name: string;
};

// Le B du BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    //Fetch toutes les données des parfums
    const perfumes = await perfumeRepository.browse();
    //Reponse avec les données en JSON
    res.status(200).json(perfumes);
  } catch (error) {
    // Transmet l'erreur au middleware d'erreur
    next(error);
  }
};

// Le R du BREAD - Lis la requête
const read: RequestHandler = async (req, res, next) => {
  try {
    //Fecth l'ID du parfum depuis les paramètres de la requête
    const perfumeId = Number(req.params.id);
    if (Number.isNaN(perfumeId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    const perfume = await perfumeRepository.read(perfumeId);
    // Si le parfum n'existe pas, renvoie 404
    if (!perfume) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(perfume);
  } catch (error) {
    // Si une erreur se produit, la transmet au middleware d'erreur
    next(error);
  }
};

// Le E de BREAD - Edit (Update) operation
const update: RequestHandler = async (req, res, next) => {
  try {
    // Mise à jour d'un parfum
    // Récupération de l'ID du parfum depuis les paramètres de la requête
    const perfumeId = Number(req.params.id);
    if (Number.isNaN(perfumeId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }

    const { name, brand_id, release_year, gender_id, image_url, description } =
      req.body;

    const affectedRows = await perfumeRepository.update(perfumeId, {
      name,
      brand_id,
      release_year,
      gender_id,
      image_url: image_url ?? null,
      description: description ?? null,
    });

    // Si la catégorie n’est pas trouvée, répondre avec un code HTTP 404 (Non trouvé)
    // Sinon, répondre avec la catégorie au format JSON.
    if (!affectedRows) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    // Transmettre toute erreur au middleware de gestion des erreurs.
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Extraire les données du parfum depuis le corps de la requête
    // et vérifier que les champs requis sont présents
    const { name, brand_id, release_year, gender_id, image_url, description } =
      req.body;
    if (!name || !brand_id || !release_year || !gender_id) {
      res.status(400).json({ error: "Champs requis manquants" });
      return;
    }
    // Créer un nouveau parfum dans la base de données
    const insertId = await perfumeRepository.create({
      name,
      brand_id,
      release_year,
      gender_id,
      image_url: image_url ?? null,
      description: description ?? null,
    });
    // Répondre avec le nouvel ID du parfum créé
    res.status(201).json({ insertId });
  } catch (error) {
    // Si une erreur se produit, la transmettre au middleware d'erreur
    next(error);
  }
};

// Le D de Destroy - Supprimer l'élément
const destroy: RequestHandler = async (req, res, next) => {
  try {
    // Récupération de l'ID du parfum depuis les paramètres de la requête
    const perfumeId = Number(req.params.id);
    if (Number.isNaN(perfumeId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    // Appel de la méthode de suppression du dépôt
    const deleted = await perfumeRepository.destroy(perfumeId);
    if (!deleted) {
      res.sendStatus(404);
      return;
    }
    // Si la suppression est réussie, renvoie un statut 200
    res.status(200).json({ message: "Parfum supprimé" });
  } catch (error) {
    // Si une erreur se produit, la transmettre au middleware d'erreur
    next(error);
  }
};

// Recherche par nom ou marque
const search: RequestHandler = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (typeof q !== "string" || q.trim() === "") {
      res.status(400).json({ error: "Paramètre de recherche manquant" });
      return;
    }

    const perfumes = await perfumeRepository.search(q.trim());
    res.status(200).json(perfumes);
  } catch (error) {
    next(error);
  }
};

// Récupérer les notes associées à un parfum
const getNotesByPerfume: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const perfumeId = Number(req.params.id);
  if (Number.isNaN(perfumeId)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }
  // Requête SQL : jointure entre perfume_note et olfactory_note
  try {
    const [rows] = await client.query(
      `
      SELECT pn.note_type, oname.name AS note_name
      FROM perfume_note pn
      JOIN olfactory_note oname ON pn.note_id = oname.id
      WHERE pn.perfume_id = ?
      `,
      [perfumeId],
    );

    // Définir le type des lignes SQL
    const notes = (rows as NoteRow[]).map((row) => ({
      type: row.note_type,
      value: row.note_name,
    }));

    res.status(200).json(notes);
  } catch (error) {
    console.error("Erreur récupération notes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export default {
  browse,
  read,
  add,
  destroy,
  update,
  search,
  getNotesByPerfume,
};
