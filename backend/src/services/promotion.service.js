const promotionRepository = require('../repositories/promotion.repository');

const getPromotionsPage = async (filters = {}) => {
  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 20;
  const offset = (page - 1) * limit;

  // Fetch all data in parallel
  const [discountedResult, promotions, coupons] = await Promise.all([
    promotionRepository.findDiscountedProducts(limit, offset),
    promotionRepository.findActivePromotions(),
    promotionRepository.findActiveCoupons()
  ]);

  // Fetch products for each active promotion
  const promotionsWithProducts = await Promise.all(
    promotions.map(async (promo) => {
      const products = await promotionRepository.findPromotionProducts(promo.id);
      return { ...promo, products };
    })
  );

  return {
    discounted_products: discountedResult.products,
    pagination: {
      total: discountedResult.total,
      page,
      limit,
      totalPages: Math.ceil(discountedResult.total / limit)
    },
    promotions: promotionsWithProducts,
    coupons
  };
};

module.exports = {
  getPromotionsPage
};
