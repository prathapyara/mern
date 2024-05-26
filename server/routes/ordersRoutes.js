import { Router } from "express";
import { getUserOrder,getOrder,createOrder,updateOrderToPaid,updateOrderToDelivered,getadminOrders,getOrderForAnalysis} from "../controllers/ordersController.js";
import { verifyIsLoggedIn,verifyIsAdmin } from "../middleware/verifyAuthToken.js"
const router=Router();

//user routes
router.use(verifyIsLoggedIn);
router.get("/",getUserOrder);
router.get("/user/:orderId",getOrder);
router.post("/",createOrder);
router.patch("/paid/:id",updateOrderToPaid);

//admin routes
router.use(verifyIsAdmin);
router.patch("/delivered/:id",updateOrderToDelivered);
router.get("/admin/",getadminOrders);
router.get("/analysis/:date",getOrderForAnalysis);

export default router; 