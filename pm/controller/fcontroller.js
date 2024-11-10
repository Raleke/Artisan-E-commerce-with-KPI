const Transaction = require('../models/transaction');
const inventory = require("../models/inventory");
const Feedback = require('../models/feedback');


const getAllInventory = async (req, res) => {
    try {
        const inventoryData = await Inventory.find({});
        res.status(200).json(inventoryData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inventory data', error: error.message });
    }
};


const submitFeedback = async (req, res) => {
    try {
        const { unitLocation, rating, comments } = req.body;
        const user = req.user; 

        
        if (!unitLocation || !rating) {
            return res.status(400).json({ message: 'Unit location and rating are required' });
        }

        const newFeedback = new Feedback({
            unitLocation,
            user: user._id,
            rating,
            comments
        });

        await newFeedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
};


const getFeedbackByUnit = async (req, res) => {
    try {
        const { unitLocation } = req.params;
        const feedback = await Feedback.find({ unitLocation })
            .populate('user', 'username email') 
            .exec();

        if (feedback.length === 0) {
            return res.status(404).json({ message: 'No feedback found for this unit' });
        }

        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
};


const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({});
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
};


const aggregateSales = async (req, res) => {
    try {
        const transactions = await Transaction.aggregate([
            { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }
        ]);

        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No sales data available' });
        }

        res.status(200).json({ totalSales: transactions[0].totalSales });
    } catch (error) {
        res.status(500).json({ message: 'Error aggregating sales', error: error.message });
    }
};


const aggregateInventory = async (req, res) => {
    try {
        const inventory = await inventory.aggregate([
            { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }
        ]);

        if (inventory.length === 0) {
            return res.status(404).json({ message: 'No inventory data available' });
        }

        res.status(200).json({ totalInventory: inventory[0].totalQuantity });
    } catch (error) {
        res.status(500).json({ message: 'Error aggregating inventory data', error: error.message });
    }
};

module.exports = { getAllInventory, submitFeedback, getFeedbackByUnit ,getAllTransactions, aggregateSales, aggregateInventory };
