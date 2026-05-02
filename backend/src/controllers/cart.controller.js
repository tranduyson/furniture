const cartService = require('../services/cart.service');

const getCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;

    const cart = await cartService.fetchCart(userId, sessionId);
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    let sessionId = req.headers['x-session-id'] || null;
    
    // Auto generate session id if not logged in
    if (!userId && !sessionId) {
      sessionId = require('crypto').randomBytes(16).toString('hex');
    }

    const { variant_id, quantity } = req.body;
    const result = await cartService.addItemToCart(userId, sessionId, variant_id, quantity);

    res.status(200).json({ success: true, message: 'Thêm vào giỏ hàng thành công', data: { ...result, sessionId } });
  } catch (err) {
    next(err);
  }
};

const applyCoupon = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;
    const { coupon_code } = req.body;

    const cart = await cartService.applyCartCoupon(userId, sessionId, coupon_code);
    res.status(200).json({ success: true, message: 'Áp dụng mã giảm giá thành công', data: cart });
  } catch (err) {
    next(err);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;
    const { cart_item_id } = req.body;

    const cart = await cartService.removeItemFromCart(userId, sessionId, cart_item_id);
    res.status(200).json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng', data: cart });
  } catch (err) {
    next(err);
  }
};

const updateQuantity = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;
    const { cart_item_id, quantity } = req.body;

    const cart = await cartService.updateItemQuantity(userId, sessionId, cart_item_id, quantity);
    res.status(200).json({ success: true, message: 'Cập nhật số lượng thành công', data: cart });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addToCart,
  applyCoupon,
  removeFromCart,
  updateQuantity
};
