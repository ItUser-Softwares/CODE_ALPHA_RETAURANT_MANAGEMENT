const express = require('express');
const order = express.Router();
const { Order } = require('../../models');


order.get('/',async function (req, res, next) {
    await Order.findAll().then(orders => {
        res.render('orders', { orders });
    });
});
  
order.get('/:id',async function (req, res, next) {
    await Order.findByPk(req.params.id).then(order => {
        return res.render('receipt', { order });
    });
});
  

order.post('/:id', async function (req, res, next) {
    try {
        // Find the order by primary key (ID)
        const order = await Order.findByPk(req.params.id);

        // Check if the order exists
        if (!order) {
            return res.status(404).send('Order not found');
        }

        // Mark the order as paid
        order.isPaid = true;

        // Save the order
        await order.save();
        return res.redirect('/orders');
    } catch (error) {

        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = order;