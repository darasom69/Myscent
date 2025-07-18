import bcrypt from "bcrypt";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import usersRepository from "./usersRepository";

// 🔹 Environnement secret pour JWT
const JWT_SECRET = process.env.JWT_SECRET as string;

// -------- REGISTER --------
export const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "Champs requis manquants" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = await usersRepository.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({ message: "Utilisateur créé", id });
  } catch (error) {
    next(error);
  }
};

// -------- LOGIN --------
export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email et mot de passe requis" });
      return;
    }

    const user = await usersRepository.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Identifiants invalides" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ error: "Identifiants invalides" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" },
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// -------- BROWSE (Admin) --------
export const browse: RequestHandler = async (req, res, next) => {
  try {
    const users = await usersRepository.browse();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// -------- READ (Admin) --------
export const read: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await usersRepository.read(id);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// -------- UPDATE (Admin) --------
export const update: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { username, email, role } = req.body;

    const affectedRows = await usersRepository.update(id, {
      username,
      email,
      role,
    });
    if (!affectedRows) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

// -------- DELETE (Admin) --------
export const destroy: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const affectedRows = await usersRepository.delete(id);
    if (!affectedRows) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export default { browse, read, register, login, update, destroy };
