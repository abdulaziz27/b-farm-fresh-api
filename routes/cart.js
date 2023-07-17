const express = require('express');
const router = express.Router();
const { OrderItem } = require('../models/order-item');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API endpoints for managing the shopping cart items.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the cart item.
 *         quantity:
 *           type: number
 *           description: The quantity of the product in the cart.
 *         product:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: The auto-generated id of the product.
 *             name:
 *               type: string
 *               description: The name of the product.
 *             description:
 *               type: string
 *               description: The description of the product.
 *             richDescription:
 *               type: string
 *               description: The rich description of the product.
 *             image:
 *               type: string
 *               description: The image URL of the product.
 *             price:
 *               type: number
 *               description: The price of the product.
 *             category:
 *               type: string
 *               description: The category id of the product.
 *             countInStock:
 *               type: number
 *               description: The count of the product in stock.
 *             rating:
 *               type: number
 *               description: The rating of the product.
 *             numReviews:
 *               type: number
 *               description: The number of reviews for the product.
 *             isFeatured:
 *               type: boolean
 *               description: Whether the product is featured or not.
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get a list of all items in the shopping cart.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns a list of cart items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *
 *   post:
 *     tags: [Cart]
 *     summary: Add a new item to the shopping cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: The quantity of the product to add to the cart.
 *               product:
 *                 type: string
 *                 description: The ID of the product to add to the cart.
 *             required:
 *               - quantity
 *               - product
 *     responses:
 *       '201':
 *         description: Successful operation. Returns the newly added cart item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     tags: [Cart]
 *     summary: Update the quantity of a cart item by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cart item to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: The new quantity of the cart item.
 *             required:
 *               - quantity
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the updated cart item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *
 *   delete:
 *     tags: [Cart]
 *     summary: Delete a cart item by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cart item to delete.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns a success message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message describing the result of the operation.
 */

router.get('/', async (req, res) => {
    try {
      const orderItems = await OrderItem.find().populate('product');
  
      res.json(orderItems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
  try {
    const { quantity, product } = req.body;

    const orderItem = new OrderItem({
      quantity,
      product,
    });

    const savedOrderItem = await orderItem.save();

    res.status(201).json(savedOrderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
  
      const orderItem = await OrderItem.findById(id);
  
      if (!orderItem) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      orderItem.quantity = quantity;
  
      const updatedOrderItem = await orderItem.save();
  
      res.json(updatedOrderItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrderItem = await OrderItem.findByIdAndRemove(id);

    if (!deletedOrderItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;