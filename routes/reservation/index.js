const express = require('express');
var reservation = express.Router();
const { Reservation } = require('../../models');

reservation.get('/', async function (req, res, next) {
    Reservation.sync();
    const tables = await Reservation.findAll();
    return res.render('tables', { tables: tables });
});


reservation.post('/new', async function (req, res, next) {
    Reservation.sync();
    const tbNumber = await Reservation.count() + 1;
    const tables = await Reservation.create({ tableNumber: tbNumber });
    return res.redirect('/reservation');
});

reservation.post('/cancel/:id', async function (req, res, next) {
    Reservation.sync();
    const tbNumber = req.params.id;
    await Reservation.update({ isReserved: 0,customerName: null,contactNumber: null, numberOfGuests:null,reservationDate:null }, { where: { tableNumber: tbNumber } });
    return res.redirect('/reservation');
});

reservation.post('/:id', async (req, res) => {
    Reservation
    const { customerName, contactNumber, numberOfGuests, reservationDate, tableNumber, isReserved } = req.body;

    try {
        // Update reservation
        const [updated] = await Reservation.update({
            customerName,
            contactNumber,
            numberOfGuests,
            reservationDate: new Date(reservationDate), // ensure correct date format
            tableNumber,
            isReserved: parseInt(isReserved) // Ensure isReserved is stored as an integer
        }, {
            where: { id: req.params.id }
        });

        if (updated) {
            res.json({ success: true, message: 'Reservation updated successfully.' });
        } else {
            res.status(404).json({ success: false, message: 'Reservation not found.' });
        }
    } catch (error) {
        console.error('Error updating reservation:', error);
        res.status(500).json({ success: false, message: 'Error updating reservation.' });
    }
});

module.exports = reservation;
