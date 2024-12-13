import express from "express";
import verifyToken  from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import {
    getAllOrders,
    updateOrderStatus,
    getRecentOrders,
    getOrderDetails, 
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(verifyToken, verifyAdmin);

router.get("/", getAllOrders);
router.get("/recent", getRecentOrders);
router.get("/:orderId", getOrderDetails);
router.put("/:orderId/status", updateOrderStatus);

export default router;
