const productService = require('../services/product.service');

const getProducts = async (req, res, next) => {
  try {
    const filters = req.query; // limit, page, category, collection, etc.
    const result = await productService.getProductsList(filters);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await productService.getProductDetails(slug);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const data = await productService.getAllCategories();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getCollections = async (req, res, next) => {
  try {
    const data = await productService.getAllCollections();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  getCategories,
  getCollections
};
