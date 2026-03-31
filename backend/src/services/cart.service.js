const cartRepository = require('../repositories/cart.repository');
const { AppError } = require('../middlewares/errorHandler.middleware');

const ensureCart = async (userId, sessionId) => {
  let cart = await cartRepository.findCart(userId, sessionId);
  if (!cart) {
    const cartId = await cartRepository.createCart(userId, sessionId);
    cart = { id: cartId, user_id: userId, session_id: sessionId, coupon_id: null };
  }
  return cart;
};

const fetchCart = async (userId, sessionId) => {
  const cart = await ensureCart(userId, sessionId);
  const items = await cartRepository.getCartItems(cart.id);
  
  // Calculate total using Stored Procedure
  const totals = await cartRepository.calculateCartTotal(cart.id);

  return { cart, items, totals };
};

const addItemToCart = async (userId, sessionId, variantId, quantity) => {
  const cart = await ensureCart(userId, sessionId);
  
  // Kiểm tra variant tồn tại và giá
  const variant = await cartRepository.findVariantForCart(variantId);
  if (!variant || variant.stock_qty < quantity) {
    throw new AppError('Sản phẩm không đủ số lượng hoặc không tồn tại', 400);
  }

  const unitPrice = variant.price_override || variant.base_price;
  await cartRepository.upsertCartItem(cart.id, variantId, quantity, unitPrice);

  return { cart_id: cart.id, variant_id: variantId, quantity };
};

const applyCartCoupon = async (userId, sessionId, couponCode) => {
  const cart = await ensureCart(userId, sessionId);
  
  if (!couponCode) {
    await cartRepository.removeCouponFromCart(cart.id);
    return await fetchCart(userId, sessionId);
  }

  const coupon = await cartRepository.findActiveCoupon(couponCode);
  if (!coupon) throw new AppError('Mã giảm giá không hợp lệ hoặc đã hết hạn', 400);

  // Check min order value vs subtotal
  const totals = await cartRepository.calculateCartTotal(cart.id);
  if (totals.p_subtotal < coupon.min_order_value) {
    throw new AppError(`Đơn hàng cần đạt tối thiểu ${coupon.min_order_value} để dùng mã này`, 400);
  }

  await cartRepository.applyCouponToCart(cart.id, coupon.id);
  return await fetchCart(userId, sessionId);
};

module.exports = {
  fetchCart,
  addItemToCart,
  applyCartCoupon
};
