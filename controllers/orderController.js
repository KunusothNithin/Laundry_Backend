const { models } = require('mongoose');
const Order = require('../models/Order');

const placeOrder = async (req, res) => {
    try{
        const userId = req.user._id;

        const {user, items, totalAmount} = req.body;
        const newOrder = new Order({user:userId, items, totalAmount});
        await newOrder.save();

        res.status(201).json({message: "Order Placed",order: newOrder});
    }catch(error){
        res.status(500).json({message: "Error Placing the Order", error: error.message});
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
    try{
        const orderId = req.params.id;
        const {status, paymentStatus} = req.body;

        const updateOrder = await Order.findByIdAndUpdate(orderId,{status,paymentStatus},{new: true});

        res.status(200).json({message: "Order updated", order: updateOrder});
    }catch(error){
        res.status(500).json({message: "Error updating order",error: error.message});
    }
};

module.exports = {
    placeOrder,
    getAllOrders,
    getOrdersByUser,
    updateOrderStatus,
};