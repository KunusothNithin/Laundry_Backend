const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');


const {
    placeOrder,
    getAllOrders,
    getOrdersByUser,
    updateOrderStatus,
    getOrderStatus
} = require('../controllers/orderController');

router.post('/placeOrder',protect,placeOrder);
router.get('/allOrders', protect, adminOnly,getAllOrders);
router.get('/orderByUser/:id',protect,getOrdersByUser);
router.get('/orderStatus/:id',protect,getOrderStatus);
router.put('/updateStatus/:id',protect,adminOnly,updateOrderStatus);

module.exports = router;