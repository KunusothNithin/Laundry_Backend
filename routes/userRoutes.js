const express = require('express');
const { registerUser, loginUser, getAllUsers,getUser,updateRole, updateProfile } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload =  require("../middleware/upload");

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/profile/:id',protect,getUser);
router.get('/allUsers',  getAllUsers);
router.put('/updateprofile/:id',protect,upload.single("profilePic"),updateProfile);
router.put('/updateRole/:id',protect,updateRole);

module.exports = router;