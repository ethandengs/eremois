import { Router } from "express";
import { signup, login, me } from "../controllers/auth";
import { authenticate } from "../middleware/auth";

const router = Router();

// Authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticate, me);

export default router;
