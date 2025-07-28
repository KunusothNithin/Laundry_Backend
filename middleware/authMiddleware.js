const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res,next) => {
    let token = req.headers.authorization;

    if(token && token.startsWith('Bearer')){
        try{
            token = token.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
        return res.status(401).json({ message: "User not found in DB" });
      }
            req.user = user;
      next();

        }catch{
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }else{
        res.status(401).json({ message: "Not authorized, no token" });
    }
};


const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { protect, adminOnly };