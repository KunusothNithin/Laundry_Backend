const express = require('express');
const { registerUser, loginUser, getAllUsers,getUser,updateRole } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/profile/:id',protect,getUser);
router.get('/allUsers',getAllUsers);
router.put('/updateRole/:id',updateRole);

module.exports = router;