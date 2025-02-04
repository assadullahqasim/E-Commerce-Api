import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.get("/",(req,res)=>{
    res.status(200).json({message:"Hello World"})
})

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//*---> import routers
import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import cartRouter from "./routes/cart.routes.js"
import orderRouter from "./routes/order.routes.js"
import adminRouter from "./routes/admin.routes.js"

//*---> use routers
app.use("/api/v1/user",userRouter)
app.use("/api/v1/product",productRouter)
app.use("/api/v1/cart",cartRouter)
app.use("/api/v1/order",orderRouter)
app.use("/api/v1/admin",adminRouter)
export {app}