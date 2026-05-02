const productRepository = require('../repositories/product.repository');
const { AppError } = require('../middlewares/errorHandler.middleware');

const getProductsList = async (filters) => {
  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 12;
  const offset = (page - 1) * limit;

  const { products, total } = await productRepository.findProducts(filters, limit, offset);
  
  return {
    data: {
      products,
      pagination: {
        total_items: total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  };
};

const getProductDetails = async (slug) => {
  const product = await productRepository.findBySlug(slug);
  if (!product) throw new AppError('Sản phẩm không tồn tại', 404);

  // Fetch variants, images, specs parallelly
  const [variants, images, specs] = await Promise.all([
    productRepository.findVariantsByProductId(product.id),
    productRepository.findImagesByProductId(product.id),
    productRepository.findSpecsByProductId(product.id)
  ]);

  return {
    ...product,
    variants,
    images,
    specs
  };
};

const getAllCategories = async () => {
  return await productRepository.findAllCategories();
};

const getAllCollections = async () => {
  return await productRepository.findAllCollections();
};

module.exports = {
  getProductsList,
  getProductDetails,
  getAllCategories,
  getAllCollections
};
