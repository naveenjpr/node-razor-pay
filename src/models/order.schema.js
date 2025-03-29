const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    product_details: {
        type: Array,
        required: true,
    },
    order_total: {
        type: Number,
        required: true,
    },
    razorpay_order_id: {
        type: String,
        default: null
    },
    razorpay_payment_id: {
        type: String,
        default: null
    },
    status: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7], // 1-Order Placed 2-Complete 3-Failed 4-Shipped 5-Delivered 6-Canceled 7-Refunded
        default: 1
    },
    shipping_details: {
        type: Object,
        required: true
    },
}, {
    timestamps: true
});

const orderModel = mongoose.model('order', orderSchema);

module.exports = orderModel;