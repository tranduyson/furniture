const orderService = require('../services/order.service');

const checkout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderData = req.body; // { recipient_name, recipient_phone, shipping_address, payment_method, note }
    
    const result = await orderService.processCheckout(userId, orderData);
    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const getOrderHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const history = await orderService.getUserOrders(userId);
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

const getOrderDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const details = await orderService.getOrderDetails(userId, id);
    res.status(200).json({ success: true, data: details });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkout,
  getOrderHistory,
  getOrderDetails
};
