import mongoose from "mongoose";
 
const orderSchema = mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items:[
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity:{
                    type: Number,
                    required: true,
                    min:1
                },
                price:{
                    type: Number,
                    required: true,
                    min:1
                }
                
            }
        ],
        totalAmount: {
            type: Number,
            required: true
        },
        paymentStatus:{
            type: String,
            enum: ["pending","complete","failed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
)


export const Order = mongoose.model("Order",orderSchema)