import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"; 

//? add to cart

const addToCart = asyncHandler(async(req,res)=>{

    const {productId,quantity} = req.body

    if(!productId || typeof quantity !== "number" || quantity < 1){
        throw new ApiError(400,"Invalid product ID or quantity")
    }

    const product = await Product.findById(productId)
    if(!product){
        throw new ApiError(404,"Product not found")
    }

    let cart = await Cart.findById(req.user?._id)

    if(!cart){
        cart = await Cart.create({
            user: req.user._id,
            items:[{productId: productId,quantity}]
        })
    }else{
        const existingItem = cart.items.find((item)=>item.product.toString() === productId)

        if(existingItem){
            existingItem.quantity += quantity
        }else{
            cart.items.push({productId:productId,quantity})
        }
    }

    await cart.save()

    return res.status(200).json(
        new ApiResponse(200,{cart:cart},"add product to card successfully")
    )
})

//? get cart items

const getCart = asyncHandler(async(req,res)=>{

    const cart = await Cart.findOne({user:req.user._id})

    if(!cart){
        throw new ApiError(404,"Cart does not exist")
    }

    return res.status(200).json(
        new ApiResponse(200,{cart:cart},"cart fetched successfully")
    )
})

//? update cart quantity

const updateCart = asyncHandler(async(req,res)=>{
    const cartId = req.params.id
    const {productId,quantity} = req.body

    if (!productId || typeof quantity !== "number" || quantity < 1) {
        throw new ApiError(400, "Invalid product ID or quantity");
    }

    const cart = await Cart.findById(cartId)

    if(!cart){
        throw new ApiError(404,"Cart not found")
    }

    const existingItem = cart.items.findIndex((item)=> item.product.toString() === productId)

    if(existingItem === -1){
        throw new ApiError(404,"product not found in cart")
    }

    cart.items[existingItem].quantity = quantity

    await cart.save();

    return res.status(200).json(
        new ApiResponse(200,{cart:cart},"Quantity updated successfully")
    )
})

//? delete cart 
const deleteCart = asyncHandler(async(req,res)=>{
    
    const cartId = req.params.id
    const cart = await Cart.findByIdAndDelete(cartId)

    if(!cart){
        throw new ApiError(404,"Cart not found")
    }

    return res.status(200).json(
        new ApiResponse(200,{cartId:cartId},"Cart deleted successfully")
    )
})

export {
    addToCart,
    getCart,
    updateCart,
    deleteCart
}