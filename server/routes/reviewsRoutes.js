import { Router } from "express";
import { ReviewsController } from "../controllers/reviewsController.js";
const router=Router();

router.get("/",ReviewsController)

export default router;