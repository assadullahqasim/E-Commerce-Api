import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

 
//? place Order
const placeOrder = asyncHandler(async(req,res)=>{

    const cart = await Cart.findOne({user:req.user._id})

    if(!cart || cart.items.length === 0){
        throw new ApiError(400,"Your cart is empty")
    }

    let totalAmount = 0
    const items = []

    for(const cartItem of cart.items){
        const productId = cartItem.productId
        const quantity = cartItem.quantity

        const product = await Product.findOne(productId).select("-description -images")
        console.log(product);

        if(product.stock < quantity){
            throw new ApiError(400,`Not enough stock of product: ${product.name}`)
        }

        const price = product.price

        totalAmount += price * quantity

        items.push({
            product: product._id,
            quantity,
            price
        })
    }

    const order = await Order.create(
        {
            user: req.user._id,
            items,
            totalAmount,
            paymentStatus : "pending"
        }
    )

    await order.save()

    return res.status(200).json(
        new ApiResponse(200,{order},"Order placed successfully")
    )
})

//? view order history

const orderHistory = asyncHandler(async(req,res)=>{

    const order = await Order.find({user:req.user._id})


    if (!order || order.length === 0) {
        throw new ApiError(404, "No orders found");
    }

    return res.status(200).json(
        new ApiResponse(200,{order},"Order history fetched successfully")
    )
})

export {
    placeOrder,
    orderHistory
}