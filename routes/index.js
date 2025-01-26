const express = require('express');
var router = express.Router();
const { MenuItem, Order, Inventory, sequelize } = require('../models');
const shortid = require('shortid');
const { Op } = require('sequelize');

const InventoryRouter = require('./inventory/index');
const ReportRouter = require('./report/index');
const ReservationRouter = require('./reservation/index');
const OrderRouter = require('./orders/index');



router.use('/inventory', InventoryRouter);
router.use('/report', ReportRouter);
router.use('/reservation', ReservationRouter);
router.use('/orders', OrderRouter);

/* GET home page. */
router.get('/', async function (req, res, next) {
  MenuItem.sync();
  Inventory.sync();
  Order.sync();

  // const items = MenuItem.findAll();
  const menuItems = await MenuItem.findAll();
  const inventory = await Inventory.findAll();
  res.render('index', { inventory: inventory, menuItems: menuItems });
});


router.post('/place-order', async (req, res) => {
  await Order.sync();
  await Inventory.sync();
  await MenuItem.sync();

  const { totalAmount, orderItems } = req.body;
  if (totalAmount <= 0) {
    return res.json({ success: false, message: 'Order is Empty' });
  }
  var availableQuantity;
  await orderItems.forEach(item => {
    MenuItem.findOne({ where: { id: item.menuItemID } }).then((menuItem) => {
      menuItem.inventoryItems.forEach(inventoryItem => {
        Inventory.findOne({ where: { id: inventoryItem.inventoryId } }).then((inventory) => {
           if (inventory.quantity <= inventoryItem.quantity * item.quantity) {
             return res.json({ success: false, message: `Insufficient stock for item: ${inventoryItem.name}` });
           } else {
             availableQuantity = inventory.quantity;
             inventory.quantity = availableQuantity - inventoryItem.quantity * item.quantity;
              inventory.save();
           }  
        });
      });
    });
  });

  await Order.create({
    shortId: shortid.generate(),
    totalAmount: totalAmount,
    itemsQuantity: orderItems
  });
  return res.redirect('/'); 
});


router.post('/add', async (req, res) => {
  try {
    const { name, price, inventoryItems } = req.body;

    // Create a new MenuItem record
    const menuItem = await MenuItem.create({
      name: name,
      price: price,
      inventoryItems: inventoryItems // Store inventory items as JSON
    });

    // Respond with success
    return res.json({ success: true, menuItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to add menu item' });
  }
});



module.exports = router;
