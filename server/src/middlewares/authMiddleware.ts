import type { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Définir un type pour l'utilisateur JWT
type JwtUser = {
  id: number;
  email: string;
  role: string;
};

// Étendre le type Request pour inclure 'user'
interface AuthenticatedRequest extends Request {
  user?: JwtUser;
}

// Vérifier un token
export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Token manquant" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ error: "Token invalide" });
      return;
    }
    (req as AuthenticatedRequest).user = user as JwtUser;
    next();
  });
};

// Vérifier que l’utilisateur est admin
export const requireAdmin: RequestHandler = (req, res, next) => {
  const currentUser = (req as AuthenticatedRequest).user;
  if (!currentUser || currentUser.role !== "admin") {
    res.sendStatus(403);
    return;
  }
  next();
};
