import { Router } from "express"
import {
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import verifyToken from "../middlewares/auth.middleware.js"

const router = Router()

//? addProduct
router.route("/add")
.post(verifyToken,upload.fields(
    [{
        name:"images",
        maxCount:5
    }]
),addProduct) 

//?getProduct
router.route("/get").get(getProduct)

//? updateProduct
router.route("/update/:id").put(verifyToken,upload.fields(
    [
        {
            name:"images"
        }
    ]
),updateProduct)

//? deleteProduct
router.route("/delete/:id").delete(verifyToken,deleteProduct)

export default router