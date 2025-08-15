import express from "express";
import { authenticateToken, requireAdmin } from "./middlewares/authMiddleware";
import brandActions from "./modules/brand/brandAction";
import collectionActions from "./modules/collection/collectionActions";
import genderActions from "./modules/gender/genderActions";
import itemActions from "./modules/item/itemActions";
import olfactoryFamilyActions from "./modules/olfactoryFamily/olfactoryFamilyActions";
import olfactoryNoteActions from "./modules/olfactoryNote/olfactoryNoteActions";
import perfumeActions from "./modules/perfume/perfumeActions";
import reviewActions from "./modules/review/reviewActions";
import userActions from "./modules/users/usersActions";

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

// Perfume_ notes ( many-to-many relation )
router.get("/api/perfumes/:id/notes", perfumeActions.getNotesByPerfume);

// Reviews
router.get("/api/reviews", reviewActions.browse);
router.get("/api/reviews/perfume/:perfumeId", reviewActions.findByPerfume);
router.post("/api/reviews", authenticateToken, reviewActions.add);
router.put("/api/reviews/:id", authenticateToken, reviewActions.update);
router.delete("/api/reviews/:id", authenticateToken, reviewActions.destroy);

// Auth / Users
router.post("/api/users/register", userActions.register);
router.post("/api/users/login", userActions.login);

// Admin uniquement, gestion des users protégée par authenticateToken et requireAdmin
router.get("/api/users", authenticateToken, requireAdmin, userActions.browse);
router.get("/api/users/:id", authenticateToken, requireAdmin, userActions.read);
router.put(
  "/api/users/:id",
  authenticateToken,
  requireAdmin,
  userActions.update,
);
router.delete(
  "/api/users/:id",
  authenticateToken,
  requireAdmin,
  userActions.destroy,
);

// User collection (possède / testé / wishlist)
router.get(
  "/api/users/:userId/collection",
  authenticateToken,
  collectionActions.ensureSameUser,
  collectionActions.browse,
);

router.post(
  "/api/users/:userId/collection",
  authenticateToken,
  collectionActions.ensureSameUser,
  collectionActions.add,
);

router.delete(
  "/api/users/:userId/collection/:perfumeId",
  authenticateToken,
  collectionActions.ensureSameUser,
  collectionActions.destroy,
);

export default router;
