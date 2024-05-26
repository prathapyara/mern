import { Router } from "express";
import { getUsers,createUser,loginUser,updateUserProfile,getUserProfile,userReview,getUserAdmin,updateUserAdmin,deleteUserAdmin} from "../controllers/usersController.js";
import { verifyIsAdmin, verifyIsLoggedIn } from "../middleware/verifyAuthToken.js";
const router=Router();

router.post("/register",createUser);
router.post("/login",loginUser);

//user routes
router.use(verifyIsLoggedIn)
router.put("/profile",updateUserProfile);
router.get("/profile",getUserProfile);
router.post("/review/:productId",userReview);

//admin routes
router.use(verifyIsAdmin);
router.get("/",getUsers);
router.get("/:id",getUserAdmin);
router.patch("/:id",updateUserAdmin);
router.delete("/:id",deleteUserAdmin);

export default router;