const jwt = require('jsonwebtoken');
const { User } = require('../models');
const protect = async (req, res, next) => {
let token;
if (req.headers.authorization &&
req.headers.authorization.startsWith('Bearer')) {
try {
token = req.headers.authorization.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findByPk(decoded.id, { attributes: ['id', 'name',
'email', 'role'] });
return next();
} catch (error) {
return res.status(401).json({ 
  success: false, 
  message: 'Not authorized, token failed' 
});
}
}
return res.status(401).json({ 
  success: false, 
  message: 'Not authorized, no token' 
});
};
const adminOnly = (req, res, next) => {
if (req.user && req.user.role === 'admin') return next();
return res.status(403).json({ success: false, message: 'Admin only' });
};
module.exports = { protect, adminOnly };