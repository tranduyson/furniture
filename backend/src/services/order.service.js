const orderRepository = require('../repositories/order.repository');
const cartService = require('./cart.service');
const { AppError } = require('../middlewares/errorHandler.middleware');

const processCheckout = async (userId, orderData) => {
  const { recipient_name, recipient_phone, shipping_address, payment_method, note } = orderData;
  if (!recipient_name || !recipient_phone || !shipping_address || !payment_method) {
    throw new AppError('Vui lòng điền đầy đủ thông tin giao hàng và thanh toán', 400);
  }

  // 1. Fetch Cart Data
  const { cart, items, totals } = await cartService.fetchCart(userId, null);
  
  if (!items || items.length === 0) {
    throw new AppError('Giỏ hàng trống', 400);
  }

  // Generate Order Code (e.g. MO-12345678)
  const orderCode = `MO-${Math.floor(Date.now() / 1000)}`;

  // Compile Order Data
  const newOrder = {
    order_code: orderCode,
    user_id: userId,
    recipient_name,
    recipient_phone,
    shipping_address,
    subtotal: totals.p_subtotal,
    discount_amount: totals.p_discount || 0,
    shipping_fee: 0, // Assume Free Shipping for now
    total_amount: totals.p_total,
    coupon_id: cart.coupon_id,
    coupon_code_snapshot: totals.p_coupon_code,
    payment_method,
    payment_status: 'unpaid',
    order_status: 'pending',
    note
  };

  // Compile Order Items Snapshot
  const orderItems = items.map(item => ({
    variant_id: item.variant_id,
    product_name: item.name,
    variant_sku: item.sku,
    variant_attrs: JSON.stringify({ image: item.image_url }), // Snapshot related attrs
    unit_price: item.unit_price,
    quantity: item.quantity,
    line_total: item.unit_price * item.quantity
  }));

  // 2. Perform Transaction Checkout
  const orderId = await orderRepository.createOrderWithTransaction(newOrder, orderItems, userId, cart.id);

  return { order_id: orderId, order_code: orderCode, total_amount: newOrder.total_amount };
};

const getUserOrders = async (userId) => {
  return await orderRepository.findOrdersByUserId(userId);
};

const getOrderDetails = async (userId, orderId) => {
  const order = await orderRepository.findOrderByIdAndUser(userId, orderId);
  if (!order) throw new AppError('Không tìm thấy đơn hàng', 404);

  const items = await orderRepository.findOrderItems(orderId);
  const history = await orderRepository.findOrderStatusHistory(orderId);

  return { ...order, items, history };
};

module.exports = {
  processCheckout,
  getUserOrders,
  getOrderDetails
};
