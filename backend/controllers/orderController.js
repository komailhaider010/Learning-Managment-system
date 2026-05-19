const Order = require('../models/orderModel');

const getUserOrders = async (req, res) => {
    const {content} = req.body;
    const {chapterId} = req.params;
    const {userId} = req.user;
    try {
        const orders = await Order.find({userId}).populate('courseId', 'title price thumbnail');

        if (!orders) {
            return res.status(404).json({message: "No orders found for this user"});
        }
        res.status(200).json({orders});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }

};

module.exports = {
    getUserOrders,
}