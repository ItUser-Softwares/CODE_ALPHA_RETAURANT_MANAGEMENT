const express = require('express');
const { Order } = require('../../models'); 
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const { Op } = require('sequelize');
const report = express.Router();

report.get('/', (req, res) => {
    res.render('report');
});

report.post('/', async (req, res) => {
    const { startDate, endDate } = req.body;

    try {
        // Parse the dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Check for invalid dates
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ success: false, message: 'Invalid date format' });
        }

        if (start > end) {   
            return res.status(400).json({ success: false, message: 'End date must be after start date' });
        }
        // Query the orders within the date range
        const orders = await Order.findAll({
            where: {
                createdAt: {
                    [Op.between]: [start, end]
                }
            }
        });

        // Create a new PDF document
        const doc = new PDFDocument();
        
        // Set response header to indicate a file is being sent
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=sales_report.pdf');
        
        // Pipe the PDF document to the response
        doc.pipe(res);

        // Add the title and date range
        doc.fontSize(20).text('Sales Report', { align: 'center' });
        doc.fontSize(12).text(`Date Range: ${startDate} to ${endDate}`, { align: 'center' });
        doc.moveDown();

        // Add the order details to the PDF
        let totalSales = 0;
        orders.forEach(order => {
            const orderDetails = `Order ID: ${order.id} | Total Amount: $${order.totalAmount}`;
            doc.fontSize(10).text(orderDetails);
            totalSales += order.totalAmount;
        });

        // Add total sales
        doc.moveDown().fontSize(12).text(`Total Sales: $${totalSales}`, { align: 'right' });

        // Finalize the PDF and send it to the client
        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error generating PDF report' });
    }
});

module.exports = report;
