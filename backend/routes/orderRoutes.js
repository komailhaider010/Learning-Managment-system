const express = require('express');

const { authenticateUser } = require('../middleware/auth');
const { getUserOrders } = require('../controllers/orderController');

const router = express.Router();

router.get('/user-orders', authenticateUser, getUserOrders);

module.exports = router;