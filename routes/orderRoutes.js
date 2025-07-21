const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');


const {
    placeOrder,
    getAllOrders,
    getOrdersByUser,
    updateOrderStatus
} = require('../controllers/orderController');

router.post('/',protect,placeOrder);
router.get('/', protect, adminOnly,getAllOrders);
router.get('/user/:id',protect,getOrdersByUser);
router.put('/:id',protect,updateOrderStatus);

module.exports = router;