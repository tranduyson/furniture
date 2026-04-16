const orderService = require('../services/order.service');

const checkout = async (req, res, next) => {
  try {
    const userId = req.user?.id || null; // Allow guest checkout (null user_id)
    const orderData = req.body; // { recipient_name, recipient_phone, shipping_address, payment_method, note }
    console.log('[ORDER.CONTROLLER] checkout - userId:', userId, 'orderData:', orderData);
    
    const result = await orderService.processCheckout(userId, orderData);
    console.log('[ORDER.CONTROLLER] checkout result:', result);
    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      data: result
    });
  } catch (err) {
    console.error('[ORDER.CONTROLLER] checkout error:', err);
    next(err);
  }
};

const getOrderHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log('[ORDER.CONTROLLER] getOrderHistory - userId from token:', userId, 'req.user:', req.user);
    const history = await orderService.getUserOrders(userId);
    console.log('[ORDER.CONTROLLER] Response to send:', { success: true, data: history });
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

const getOrderDetails = async (req, res, next) => {
  try {
    debugger
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
