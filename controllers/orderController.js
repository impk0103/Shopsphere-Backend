const OrderModel = require("../models/orderModel");

const newOrder = async (req, res) => {
    try {
        const {
            buyer,
            shippingData,
            orderedProducts,
            paymentInfo,
            productsQuantity,
            totalPrice,
        } = req.body;

        if (!buyer || !shippingData || !orderedProducts || !paymentInfo) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const orderData = {
            buyer,
            shippingData,
            orderedProducts,
            paymentInfo,
            productsQuantity: productsQuantity || 0,
            totalPrice: totalPrice || 0,
            orderStatus: "Processing",
            sellerId:orderedProducts.sellerID,
        };

        const createdOrder = await OrderModel.createOrder(orderData);
        return res.status(201).json(createdOrder);
    } catch (err) {
        console.error("Order creation failed:", err);
        res.status(500).json({ error: "Failed to create order", details: err.message });
    }
};

const newOrders = async (req, res) => {
    try {
        const createdOrders = await OrderModel.createOrders(req.body);
        return res.json(createdOrders);
    } catch (err) {
        res.status(500).json({ error: "Failed to create order", details: err.message });
    }
};    

const getOrderedProductsByCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const orders = await OrderModel.getOrdersByCustomer(id);

        if (orders.length > 0) {
            const orderedProducts = orders.flatMap(order => order.OrderedProducts);
            res.json(orderedProducts);
        } else {
            res.json({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch orders", details: err.message });
    }
};

const getOrderedProductsBySeller = async (req, res) => {
    try {
        const {id} = req.params;
        const orders = await OrderModel.getOrdersBySeller(id);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    newOrder,
    newOrders,
    getOrderedProductsByCustomer,
    getOrderedProductsBySeller
};
