import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true
        },
        description:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true,
            min: 0
        },
        category:{
            type: String,
            required: true,
            trim: true
        },
        stock:{
            type: Number,
            required: true,
            min: 0
        },
        images:[
            {
                type: String // cloudinary url
            }
        ]
    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model("Product",productSchema)