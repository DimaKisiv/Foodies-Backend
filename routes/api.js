import { Router } from "express";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import categoriesRouter from "./categories.js";
import ingredientsRouter from "./ingredients.js";
import areasRouter from "./areas.js";
import recipesRouter from "./recipes.js";
import testimonialsRouter from "./testimonials.js";

const router = Router();
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/categories", categoriesRouter);
router.use("/ingredients", ingredientsRouter);
router.use("/areas", areasRouter);
router.use("/recipes", recipesRouter);
router.use("/testimonials", testimonialsRouter);
export default router;
