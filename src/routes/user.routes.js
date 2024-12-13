import express from "express"
import {
    registerUser,
    loginUser,
    logOutUer,
    getProfile
} from "../controllers/user.controller.js"
import {validator,handleValidationErrors} from "../middlewares/validation.middleware.js"
import jwtToken from "../middlewares/auth.middleware.js"

const router = express.Router()

//? registerUser
router.route("/register").post([validator(),handleValidationErrors],registerUser)

//? loginUser
router.route("/login").post(loginUser)

//?logOutUer
router.route("/logout").post(jwtToken,logOutUer)

//? getProfile
router.route("/profile").get(jwtToken,getProfile)

export default router