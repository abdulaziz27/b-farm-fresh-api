const {Order} = require('../models/order');
const { OrderItem } = require('../models/order-item');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API endpoints for managing orders.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the order item.
 *         quantity:
 *           type: number
 *           description: The quantity of the product in the order.
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
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the order.
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         shippingAddress1:
 *           type: string
 *           description: The first line of the shipping address.
 *         shippingAddress2:
 *           type: string
 *           description: The second line of the shipping address.
 *         city:
 *           type: string
 *           description: The city of the shipping address.
 *         zip:
 *           type: string
 *           description: The zip code of the shipping address.
 *         country:
 *           type: string
 *           description: The country of the shipping address.
 *         phone:
 *           type: string
 *           description: The phone number of the customer.
 *         status:
 *           type: string
 *           description: The status of the order (e.g., 'Pending', 'Shipped', 'Delivered').
 *         totalPrice:
 *           type: number
 *           description: The total price of the order.
 *         user:
 *           type: string
 *           description: The ID of the user who placed the order.
 *         dateOrdered:
 *           type: string
 *           format: date-time
 *           description: The date and time when the order was placed.
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get a list of all orders.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns a list of orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     quantity:
 *                       type: number
 *                       description: The quantity of the product in the order.
 *                     product:
 *                       type: string
 *                       description: The ID of the product to add to the order.
 *                 description: The list of items in the order.
 *               shippingAddress1:
 *                 type: string
 *                 description: The first line of the shipping address.
 *               shippingAddress2:
 *                 type: string
 *                 description: The second line of the shipping address.
 *               city:
 *                 type: string
 *                 description: The city of the shipping address.
 *               zip:
 *                 type: string
 *                 description: The zip code of the shipping address.
 *               country:
 *                 type: string
 *                 description: The country of the shipping address.
 *               phone:
 *                 type: string
 *                 description: The phone number of the customer.
 *               status:
 *                 type: string
 *                 description: The status of the order (e.g., 'Pending', 'Shipped', 'Delivered').
 *               user:
 *                 type: string
 *                 description: The ID of the user who placed the order.
 *             required:
 *               - orderItems
 *               - shippingAddress1
 *               - city
 *               - country
 *               - phone
 *               - status
 *               - user
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the newly created order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     tags: [Orders]
 *     summary: Update the status of an order by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the order (e.g., 'Pending', 'Shipped', 'Delivered').
 *             required:
 *               - status
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the updated order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *
 *   delete:
 *     tags: [Orders]
 *     summary: Delete an order by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order to delete.
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

/**
 * @swagger
 * /api/orders/get/count:
 *   get:
 *     tags: [Orders]
 *     summary: Get the total count of all orders.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the total count of orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderCount:
 *                   type: number
 *                   description: The total count of orders.
 */

/**
 * @swagger
 * /api/orders/get/userorders/{userid}:
 *   get:
 *     tags: [Orders]
 *     summary: Get a list of orders for a specific user.
 *     parameters:
 *       - in: path
 *         name: userid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to retrieve orders for.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns a list of orders for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */

router.get(`/`, async (req, res) =>{
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})

router.get(`/:id`, async (req, res) =>{
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        });

    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order);
})

router.post('/', async (req,res)=>{
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved =  await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b) => a +b , 0);

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if(!order)
    return res.status(400).send('the order cannot be created!')

    res.send(order);
})

router.put('/:id',async (req, res)=> {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true}
    )

    if(!order)
    return res.status(400).send('the order cannot be update!')

    res.send(order);
})

router.delete('/:id', (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get('/get/totalsales', async (req, res)=> {
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
})

router.get(`/get/count`, async (req, res) => {
    try {
        const orderCount = await Order.countDocuments();
        
        if (!orderCount) {
            return res.status(500).json({ success: false });
        }     
        res.send({ orderCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
})

// get user order
router.get(`/get/userorders/:userid`, async (req, res) =>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        }).sort({'dateOrdered': -1});
    // sorted from newest 

    if(!userOrderList) {
        res.status(500).json({success: false})
    } 
    res.send(userOrderList);
})

module.exports =router;