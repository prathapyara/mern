import { Router } from "express";
import { getProdcuts,getProductById,getBestSellers,adminGetProducts, adminDeleteProducts, adminCreateProduct,adminUpdateProdcuts, adminUploadImage,adminDeleteProductImage} from "../controllers/productController.js";
import { verifyIsLoggedIn,verifyIsAdmin } from "../middleware/verifyAuthToken.js";

const router=Router();

router.get("/category/:categoryName/search/:searchQuery",getProdcuts); //we do filter from the homepage and we use this in homepage
router.get("/category/:categoryName",getProdcuts); //we use this in homepage
router.get("/search/:searchQuery",getProdcuts); //we use this in productspage
router.get("/",getProdcuts) //we use this in products page
router.get("/bestsellers",getBestSellers);
router.get("/get-one/:id",getProductById);


//admin routes
router.use(verifyIsLoggedIn);
router.use(verifyIsAdmin);
router.get("/admin",adminGetProducts);
router.delete("/admin/:id",adminDeleteProducts);
router.post("/admin",adminCreateProduct);
router.patch("/admin/:id",adminUpdateProdcuts);
router.post("/admin/upload/",adminUploadImage);
router.delete("/admin/image/:imagePath/:productId",adminDeleteProductImage);


export default router;