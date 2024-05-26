import { Router } from "express";
import { deleteCategory, getCategories, newAttributeCategory, newCategory } from "../controllers/categroyController.js";

const router=Router();

router.get("/",getCategories);
router.post("/",newCategory);
router.delete("/:category",deleteCategory);
router.post("/newAttrs",newAttributeCategory);

export default router;