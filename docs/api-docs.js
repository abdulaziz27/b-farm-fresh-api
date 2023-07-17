const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Banyumas Farm Fresh API',
      version: '1.0.0',
      description: 'Welcome to the API documentation for Banyumas Farm Fresh! This documentation provides detailed information about the available API endpoints and their functionalities.',
    },
    servers: [
      {
        url: 'b-farm-fresh-api.vercel.app',
        description: 'Deployment server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      }
    ],
    components: {
      securitySchemes:
      {
          JWT: 
        {
          name: 'User Authorization',
          description: 'Value: Bearer {token}',
          type: 'apiKey',
          scheme: 'bearer',
          in: 'header',
          bearerFormat: 'JWT'
        }
      }
    },
    externalDocs: {
      description: 'Find more info here',
      url: 'https://example.com',
    },
    contact: {
      name: 'Banyumas Farm Fresh API Support Team',
      url: 'https://example.com/contact',
      email: 'support@example.com',
    },
    // How to Use
    "x-how-to-use": "To use this API, you need to obtain an API key by signing up on our website. Once you have the API key, include it as a query parameter 'api_key' in your requests to authenticate.",
    // Get Started
    "x-get-started": "To get started, explore the available endpoints in the API documentation below. If you have any questions or need assistance, feel free to reach out to our support team.",
  },
  apis: [
    './routes/users.js', 
    './routes/products.js', 
    './routes/categories.js', 
    './routes/cart.js',
    './routes/orders.js'
  ],
};

const specs = swaggerJsdoc(options);
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs, options));

module.exports = router;
