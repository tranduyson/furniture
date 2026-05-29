require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const errorHandler = require('./src/middlewares/errorHandler.middleware');

let swaggerUi, swaggerSpec;
try {
  swaggerUi = require('swagger-ui-express');
  swaggerSpec = require('./src/config/swagger');
} catch (e) {
  console.warn('[Swagger] swagger-ui-express chưa được cài. Chạy: npm install swagger-ui-express swagger-jsdoc');
}


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const uploadsPath = path.join(__dirname, 'uploads');
const variantsUploadPath = path.join(uploadsPath, 'variants');
const productsUploadPath = path.join(uploadsPath, 'products');
fs.mkdirSync(variantsUploadPath, { recursive: true });
fs.mkdirSync(productsUploadPath, { recursive: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsPath));

// Routes
const authRoutes = require('./src/routes/auth.routes');
const productRoutes = require('./src/routes/product.routes');
const cartRoutes = require('./src/routes/cart.routes');
const orderRoutes = require('./src/routes/order.routes');
const adminRoutes = require('./src/routes/admin.routes');
const promotionRoutes = require('./src/routes/promotion.routes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/promotions', promotionRoutes);

// Swagger UI (chỉ mount nếu thư viện đã được cài)
if (swaggerUi && swaggerSpec) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
}

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger UI available at: http://localhost:${PORT}/api-docs`);
});
