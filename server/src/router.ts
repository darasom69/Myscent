import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import itemActions from "./modules/item/itemActions";

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

/* ************************************************************************* */

import perfumeActions from "./modules/perfume/perfumeActions";

router.get("/api/perfumes", perfumeActions.browse);
router.get("/api/perfumes/:id", perfumeActions.read);
router.post("/api/perfumes", perfumeActions.add);
router.put("/api/perfumes/:id", perfumeActions.update);
router.delete("/api/perfumes/:id", perfumeActions.destroy);

export default router;
