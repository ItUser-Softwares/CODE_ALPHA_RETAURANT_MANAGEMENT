const { Inventory } = require("../../models");
const express = require('express');
const inventory = express.Router();

//Inventory List
inventory.get('/',async function (req, res, next) {
    Inventory.sync();
    await Inventory.findAll().then(inventory => {
        res.render('inventory', { inventory: inventory });
    });
});

//Add Inventory Item
inventory.post('/', async function (req, res, next) {
    Inventory.sync();
    const { name, quantity } = req.body;
    const existingItem = await Inventory.findOne({ where: { name: name.toLowerCase() } });

    if (existingItem) {
        return res.status(400).send('Item already exists');
    } else {
        await Inventory.create({ name: name, quantity });
        const inventory = await Inventory.findAll();
        return res.render('inventory', { inventory });
    }

});


//Update Inventory
inventory.post('/:itemId',async function (req, res, next) {
    Inventory.sync();
    const { quantity } = req.body;

    await Inventory.update(
        { quantity },
        { where: { id: req.params.itemId } }
    )
        .then(() => {
            return Inventory.findAll();
        })
        .then(inventory => {
            res.redirect('/inventory');
        })
});


module.exports = inventory;