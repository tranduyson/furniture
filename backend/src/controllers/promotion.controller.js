const promotionService = require('../services/promotion.service');

const getPromotions = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await promotionService.getPromotionsPage(filters);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPromotions
};
