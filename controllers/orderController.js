const { models } = require('mongoose');
const Order = require('../models/Order');

// Price Map (Cloth Type => Price per item)
const PRICE_MAP = {
    'Shirt': 20,
    'Towel': 25,
    'Pant': 30,
    'Jeans': 35,
    'Saree': 50,
    'Blanket': 60,
    'Bedsheet': 60,
    'Kurti': 15,
};

const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'No items provided in the order.' });
        }

        // Calculate totalAmount from server side
        let totalAmount = 0;
        for (const item of items) {
            const price = PRICE_MAP[item.clothType];
            if (!price) {
                return res.status(400).json({ message: `Invalid cloth type: ${item.clothType}` });
            }
            totalAmount += price * item.quantity;
        }

        // Create and save new order
        const newOrder = new Order({
            user: userId,
            items,
            totalAmount,
        });

        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully", order: newOrder });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try{
        const orders = await Order.find().populate('user','name email');
        res.status(200).json(orders);
    }catch(error){
        res.status(500).json({message: "Error getting orders", error: error.message});
    }
};

const getOrdersByUser = async (req, res) => {
    try{
        const userId = req.params.id;
        const orders = await Order.find({user: userId});
        res.status(200).json(orders);
    }catch(error){
        res.status(500).json({message: "Error getting user orders", error: error.message});
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        // Correct usage: pass orderId directly
        const updateOrder = await Order.findByIdAndUpdate(
            orderId, // <- Not wrapped in {}
            { status },
            { new: true }
        );

        if (!updateOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        console.log(updateOrder);
        res.status(200).json({ message: "Order updated", order: updateOrder });
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error: error.message });
    }
};


const getOrderStatus = async (req, res) => {
    try{
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        res.status(200).json({message: "Orders Status Found Successfully", status: order.status});
    }catch(error){
        res.status(500).json({message: "Order Not Found",error: error.message});
    }
};

module.exports = {
    placeOrder,
    getAllOrders,
    getOrdersByUser,
    getOrderStatus,
    updateOrderStatus,
};