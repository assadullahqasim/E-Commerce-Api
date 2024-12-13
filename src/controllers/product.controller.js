import { Product } from "../models/product.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

//? post product

const addProduct = asyncHandler(async (req, res) => {

    if (!req.user || req.user.role !== "admin") {
        throw new ApiError(403, "Only Admin can update products");
    }

    const { name, description, price, category, stock } = req.body
    if (
        ["name", "description", "price", "category", "stock"].some((field) => typeof field !== "string" || field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const imageLocalPath = req.files?.images?.map(file => file.path);

    if (!imageLocalPath || imageLocalPath.length === 0) {
        throw new ApiError(400, "Image files are required");
    }

    const images = await Promise.all(
        imageLocalPath.map((path) => uploadOnCloudinary(path))
    );

    if (!images || images.length === 0) {
        throw new ApiError(400, "Failed to upload images");
    }

    const product = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        images: images.map((img) => img.url)
    })

    return res.status(200).json(
        new ApiResponse(200, { product: product }, "add Product successfully")
    )
})

const getProduct = asyncHandler(async (req, res) => {

    const { name, category } = req.query
    if (!name && !category) {
        throw new ApiError(400, "Either 'name' or 'category' is required for search");
    }

    const product = await Product.find({
        $or: [{ name }, { category }]
    })

    if (product.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, { product: [] }, "No products found")
        )
    }

    return res.status(200).json(
        new ApiResponse(200, { product: product }, "Products fetched successfully")
    )
})

const updateProduct = asyncHandler(async (req, res) => {

    if (!req.user || req.user.role !== "admin") {
        throw new ApiError(403, "Only Admin can update products");
    }

    const { name, description, price, category, stock } = req.body

    let images;
    if (req.files?.images?.map(file => file.path)) {
        const imageLocalPath = req.files?.images?.map(file => file.path);

        // Upload the image to Cloudinary
        images = await Promise.all(
            imageLocalPath.map((path) => uploadOnCloudinary(path))
        );
    
        if (!images || images.length === 0) {
            throw new ApiError(400, "Failed to upload images");
        }
    }

    const updatedFields = {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price }),
        ...(category && { category }),
        ...(stock && { stock }),
        ...(images && { images: images.map((img) => img.url)}),
    }

    const product = await Product.findByIdAndUpdate(req.params.id,
        {
            $set: updatedFields,
        },
        {
            new: true
        }
    )

    return res.status(200).json(
        new ApiResponse(200, { product: product }, "Update product successfully")
    )
})

const deleteProduct = asyncHandler(async (req, res) => {

    if (!req.user || req.user.role !== "admin") {
        throw new ApiError(403, "Only admin can delete product")
    }

    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
        throw new ApiError(404, "Product does not exist")
    }

    return res.status(200).json(
        new ApiResponse(200, { deleteProduct: product._id }, "product delete successfully")
    )
})

export {
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct
}