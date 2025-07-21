import express from "express";
import { authenticateToken, requireAdmin } from "./middlewares/authMiddleware";
import brandActions from "./modules/brand/brandAction";
import genderActions from "./modules/gender/genderActions";
import itemActions from "./modules/item/itemActions";
import olfactoryFamilyActions from "./modules/olfactoryFamily/olfactoryFamilyActions";
import olfactoryNoteActions from "./modules/olfactoryNote/olfactoryNoteActions";
import perfumeActions from "./modules/perfume/perfumeActions";
import userActions from "./modules/users/usersActions";
import {
  browse,
  destroy,
  login,
  read,
  register,
  update,
} from "./modules/users/usersActions";

const router = express.Router();

// Item
router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

// Perfume
router.get("/api/perfumes", perfumeActions.browse);
router.get("/api/perfumes/:id", perfumeActions.read);
router.post("/api/perfumes", perfumeActions.add);
router.put("/api/perfumes/:id", perfumeActions.update);
router.delete("/api/perfumes/:id", perfumeActions.destroy);
router.get("/api/perfumes/search", perfumeActions.search);

// Brand
router.get("/api/brands", brandActions.browse);
router.get("/api/brands/:id", brandActions.read);
router.post("/api/brands", brandActions.add);
router.put("/api/brands/:id", brandActions.update);
router.delete("/api/brands/:id", brandActions.destroy);

// Gender
router.get("/api/genders", genderActions.browse);
router.get("/api/genders/:id", genderActions.read);

// Olfactory Family
router.get("/api/olfactory-families", olfactoryFamilyActions.browse);
router.get("/api/olfactory-families/:id", olfactoryFamilyActions.read);

// Olfactory Note
router.get("/api/olfactory-notes", olfactoryNoteActions.browse);
router.get("/api/olfactory-notes/:id", olfactoryNoteActions.read);

// Auth / Users
router.post("/api/users/register", register);
router.post("/api/users/login", login);

// Admin uniquement, gestion des users protégée par authenticateToken et requireAdmin
router.get("/api/users", authenticateToken, requireAdmin, browse);
router.get("/api/users/:id", authenticateToken, requireAdmin, read);
router.put("/api/users/:id", authenticateToken, requireAdmin, update);
router.delete("/api/users/:id", authenticateToken, requireAdmin, destroy);

export default router;
