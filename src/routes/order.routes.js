import { Router } from "express";
import { 
    placeOrder,
    orderHistory
} from "../controllers/order.controller.js"
import verifyToken from "../middlewares/auth.middleware.js"

const router = Router()

//? placeOrder
router.route("/place-order").get(verifyToken,placeOrder)

//? orderHistory
router.route("/get-history").get(verifyToken,orderHistory)

export default router