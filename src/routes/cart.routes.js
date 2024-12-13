import { Router } from "express";
import { 
    addToCart,
    getCart,
    updateCart
} from "../controllers/cart.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router() 

//? addToCart
router.route("/add").post(verifyToken,addToCart)

//? getCart
router.route("/get").get(verifyToken,getCart)

//? updateCart
router.route("/:id").put(updateCart)



export default router