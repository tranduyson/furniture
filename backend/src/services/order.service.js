const orderRepository = require('../repositories/order.repository');
const cartService = require('./cart.service');
const { AppError } = require('../middlewares/errorHandler.middleware');

const processCheckout = async (userId, orderData) => {
  console.log('[ORDER.SERVICE] processCheckout - userId:', userId, 'orderData:', orderData);
  const { recipient_name, recipient_phone, shipping_address, payment_method, note, items: bodyItems } = orderData;
  if (!recipient_name || !recipient_phone || !shipping_address || !payment_method) {
    throw new AppError('Vui lòng điền đầy đủ thông tin giao hàng và thanh toán', 400);
  }

  let items, totals;
  
  // For guest checkout, use items from request body
  if (!userId && bodyItems && Array.isArray(bodyItems)) {
    items = bodyItems;
    // Calculate totals from items
    const subtotal = items.reduce((sum, item) => {
      const price = item.base_price * (1 - (item.discount_pct || 0) / 100);
      return sum + (price * item.quantity);
    }, 0);
    totals = {
      p_subtotal: subtotal,
      p_discount: 0,
      p_total: subtotal,
      p_coupon_code: null
    };
  } else if (userId) {
    // For authenticated users, fetch from cart
    console.log('[ORDER.SERVICE] Fetching cart for userId:', userId);
    const { cart, items: cartItems, totals: cartTotals } = await cartService.fetchCart(userId, null);
    console.log('[ORDER.SERVICE] Cart fetched - items:', cartItems.length, 'totals:', cartTotals);
    items = cartItems;
    totals = cartTotals;
  } else {
    throw new AppError('Giỏ hàng trống', 400);
  }
  
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
    coupon_id: null,
    coupon_code_snapshot: totals.p_coupon_code,
    payment_method,
    payment_status: 'unpaid',
    order_status: 'pending',
    note
  };

  // Compile Order Items Snapshot
  const orderItems = items.map(item => ({
    variant_id: item.variant_id || null,
    product_name: item.product_name || item.name,
    variant_sku: item.variant_sku || item.sku || '',
    variant_attrs: JSON.stringify({ image: item.primary_image || item.image_url || '' }), // Snapshot related attrs
    unit_price: item.unit_price || (item.base_price * (1 - (item.discount_pct || 0) / 100)),
    quantity: item.quantity,
    line_total: (item.unit_price || (item.base_price * (1 - (item.discount_pct || 0) / 100))) * item.quantity
  }));

  console.log('[ORDER.SERVICE] Creating order with transaction:', newOrder);
  // 2. Perform Transaction Checkout
  const orderId = await orderRepository.createOrderWithTransaction(newOrder, orderItems, userId, null);
  console.log('[ORDER.SERVICE] Order created successfully with ID:', orderId);

  return { order_id: orderId, order_code: orderCode, total_amount: newOrder.total_amount };
};

const getUserOrders = async (userId) => {
  console.log('[ORDER.SERVICE] getUserOrders called with userId:', userId);
  const orders = await orderRepository.findOrdersByUserId(userId);
  console.log('[ORDER.SERVICE] Found orders:', orders.length, orders);
  return orders;
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
