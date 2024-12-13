import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
 
const getAllOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, paymentStatus } = req.query;

    const filter = {};
    if (paymentStatus) {
        filter.paymentStatus = paymentStatus;
    }

    const orders = await Order.find(filter)
        .populate("user", "fullName email")
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const totalOrders = await Order.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(200, { orders, totalOrders }, "Orders fetched successfully")
    );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const allowedStatuses = ["pending", "complete", "failed"];
    if (!allowedStatuses.includes(paymentStatus)) {
        throw new ApiError(400, "Invalid payment status");
    }

    const order = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus },
        { new: true }
    );

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
        new ApiResponse(200, { order }, "Order status updated successfully")
    );
});

const getRecentOrders = asyncHandler(async (req, res) => {
    const { days = 7 } = req.query;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const orders = await Order.find({ createdAt: { $gte: fromDate } })
        .populate("user", "fullName email")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, { orders }, "Recent orders fetched successfully")
    );
});

const getOrderDetails = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate([
        { path: "user", select: "fullName email" },
        { path: "items.product", select: "name price" },
    ]);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
        new ApiResponse(200, { order }, "Order details fetched successfully")
    );
});


export {
    getAllOrders,
    updateOrderStatus,
    getRecentOrders,
    getOrderDetails
}